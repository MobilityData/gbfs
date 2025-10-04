#!/bin/bash

# Define dynamic paths for metrics and log files (based on the current working directory)
METRICS_FILE="$(pwd)/metrics.txt"
LOG_FILE="$(pwd)/gbfs_datafetch.log"
CONFIG_FILE="$(pwd)/config.json"

# MySQL credentials securely passed as environment variables
DB_HOST="gbfs-rds-instance.c1o2yci6mj2p.eu-west-2.rds.amazonaws.com"
DB_USER="manoj"
DB_PASS="Manoj2627"
DB_NAME="gbfsdb"

# Set MySQL password environment variable to avoid passing it on the command line
export MYSQL_PWD="$DB_PASS"

# Log function
log_message() {
    local message="$1"
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $message"
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $message" >> "$LOG_FILE"
}

# Create the log and metrics files if they don't exist
if [ ! -f "$METRICS_FILE" ]; then
    echo "Metrics file not found. Creating $METRICS_FILE..."
    touch "$METRICS_FILE"
fi

if [ ! -f "$LOG_FILE" ]; then
    echo "Log file not found. Creating $LOG_FILE..."
    touch "$LOG_FILE"
fi

# Ensure the config.json file exists
if [ ! -f "$CONFIG_FILE" ]; then
    log_message "Error: config.json file not found at $CONFIG_FILE"
    exit 1
fi

# Function to handle MySQL errors gracefully
check_mysql_error() {
    if [ $? -ne 0 ]; then
        log_message "MySQL error occurred while processing: $1"
    else
        log_message "MySQL operation successful for: $1"
    fi
}

# Function to fetch and process data for a provider and write Prometheus metrics
process_provider() {
    local provider="$1"
    local station_info_url="$2"
    local station_status_url="$3"
    local table_name="$4"

    log_message "Fetching station info for $provider..."

    # Fetch station information
    station_info=$(curl -s "$station_info_url")
    if [ -z "$station_info" ]; then
        log_message "Error: No data returned from station info URL for $provider"
        return
    fi

    # Fetch station status
    station_status=$(curl -s "$station_status_url")
    if [ -z "$station_status" ]; then
        log_message "Error: No data returned from station status URL for $provider"
        return
    fi

    # Process each station from station information
    echo "$station_info" | jq -c '.data.stations[]' | while read -r station; do
        station_id=$(echo "$station" | jq -r '.station_id // empty')
        station_name=$(echo "$station" | jq -r '.name // empty' | sed "s/'/''/g")
        lat=$(echo "$station" | jq -r '.lat // empty')
        lon=$(echo "$station" | jq -r '.lon // empty')

        # Skip invalid stations
        if [ -z "$station_id" ] || [ -z "$station_name" ] || [ -z "$lat" ] || [ -z "$lon" ]; then
            log_message "Skipping station with missing data: station_id=$station_id, station_name=$station_name"
            continue
        fi

        available_bikes=$(echo "$station_status" | jq --arg station_id "$station_id" -r '.data.stations[] | select(.station_id == $station_id) | .num_bikes_available // 0')

        # Fetch vehicle types and format it as a string like "TYPE:count,TYPE:count"
        vehicle_types=$(echo "$station_status" | jq --arg station_id "$station_id" -r '.data.stations[] | select(.station_id == $station_id) | .vehicle_types_available[]? | "\(.vehicle_type_id):\(.count)"' | paste -sd "," -)

        # If no vehicle types are found, set a default value
        if [ -z "$vehicle_types" ]; then
            vehicle_types="Unknown"
        fi

        # Get the current timestamp
        timestamp=$(date '+%Y-%m-%d %H:%M:%S')

        # Write Prometheus metrics for this station, including available bikes and timestamp
        echo "available_bikes{provider=\"$provider\",station_id=\"$station_id\",station_name=\"$station_name\",lat=\"$lat\",lon=\"$lon\",vehicle_type=\"$vehicle_types\"} $available_bikes" >> "$METRICS_FILE"
        echo "station_update_time{provider=\"$provider\",station_id=\"$station_id\"} $timestamp" >> "$METRICS_FILE"

        # Insert data into MySQL, including vehicle_type
        insert_query="INSERT INTO $table_name (provider, station_id, station_name, lat, lon, vehicle_type, available_bikes, timestamp)
                      VALUES ('$provider', '$station_id', '$station_name', '$lat', '$lon', '$vehicle_types', '$available_bikes', NOW())
                      ON DUPLICATE KEY UPDATE available_bikes='$available_bikes', vehicle_type='$vehicle_types', timestamp=NOW();"
        mysql -h "$DB_HOST" -u "$DB_USER" "$DB_NAME" -e "$insert_query"
        check_mysql_error "$station_name"
    done

    log_message "Finished processing $provider data."
}

# Clear the metrics file before starting fresh for all providers
> "$METRICS_FILE"

# Write Prometheus metrics header
echo "# HELP available_bikes Number of available bikes" > "$METRICS_FILE"
echo "# TYPE available_bikes gauge" >> "$METRICS_FILE"

# Read providers from the config.json file
providers=$(jq -c '.providers[]' "$CONFIG_FILE")

# Process each provider from config.json
echo "$providers" | while read -r provider_info; do
    provider=$(echo "$provider_info" | jq -r '.name')
    station_info_url=$(echo "$provider_info" | jq -r '.station_info_url')
    station_status_url=$(echo "$provider_info" | jq -r '.station_status_url')
    table_name=$(echo "$provider_info" | jq -r '.table_name')

    process_provider "$provider" "$station_info_url" "$station_status_url" "$table_name"
done

# Exit the script after processing is complete
exit 0

