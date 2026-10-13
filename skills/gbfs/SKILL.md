---
name: gbfs
description: >-
  General Bikeshare Feed Specification (GBFS v3.0 / v2.3) reference and operational runbook.
  Use when querying live bikeshare and shared micromobility availability (docked bikes, e-bikes,
  scooters, docks), parsing gbfs.json auto-discovery endpoints, resolving systems via systems.csv,
  or building/validating GBFS data feeds.
---

# General Bikeshare Feed Specification (GBFS v3.0 / v2.3) Guide

The **General Bikeshare Feed Specification (GBFS)** is the open data standard for shared micromobility (docked and dockless bicycles, e-bikes, e-scooters, mopeds, and carshare), maintained by [MobilityData](https://gbfs.org).

GBFS provides **real-time, read-only** system status intended for consumer transit advice and travel applications (Google Maps, Apple Maps, Transit App, Citymapper).

---

## 1. Core Principles & Architecture

1. **Strictly Read-Only & Real-Time:**
   - GBFS provides current operational status ("at this exact moment"). It explicitly excludes historical logs, trip trajectories, user PII, and booking/unlock actions (which belong to MDS or proprietary operator APIs).
2. **Auto-Discovery via `gbfs.json`:**
   - Every GBFS dataset exposes a single entrypoint URL: `gbfs.json`.
   - Consumers never hardcode sub-endpoint URLs; instead, they parse `gbfs.json` to discover the live URLs of individual files.
3. **Caching & TTL:**
   - Every file includes top-level `last_updated` (POSIX timestamp) and `ttl` (integer seconds).
   - Clients **must respect the `ttl`** before re-requesting an endpoint to prevent DDoS-ing public transit infrastructure.

---

## 2. Feed Auto-Discovery (`gbfs.json`)

GBFS supports two structural paradigms across versions:

### GBFS v3.0 Auto-Discovery
In GBFS 3.0, feeds are listed directly under `data.feeds`:
```json
{
  "last_updated": 1715000000,
  "ttl": 60,
  "version": "3.0",
  "data": {
    "feeds": [
      { "name": "system_information", "url": "https://example.com/gbfs/3.0/system_information" },
      { "name": "station_information", "url": "https://example.com/gbfs/3.0/station_information" },
      { "name": "station_status", "url": "https://example.com/gbfs/3.0/station_status" },
      { "name": "free_bike_status", "url": "https://example.com/gbfs/3.0/free_bike_status" }
    ]
  }
}
```

### GBFS v1.x / v2.x Auto-Discovery
In GBFS 2.x and earlier, feeds are grouped by BCP 47 language code:
```json
{
  "last_updated": 1715000000,
  "ttl": 60,
  "version": "2.3",
  "data": {
    "en": {
      "feeds": [
        { "name": "system_information", "url": "https://example.com/gbfs/en/system_information.json" },
        { "name": "station_information", "url": "https://example.com/gbfs/en/station_information.json" }
      ]
    }
  }
}
```

---

## 3. Key Endpoints Reference

| Endpoint | Required | Description |
| :--- | :---: | :--- |
| `gbfs.json` | **Yes** | Auto-discovery manifest listing URLs of all other feeds. |
| `system_information.json` | **Yes** | System ID, operator, primary language, contact info, timezone, and URL. |
| `station_information.json` | Cond. | Fixed station locations (`lat`, `lon`, `name`, `capacity`, `rental_methods`). |
| `station_status.json` | Cond. | Live docks/bikes available, installation/renting/returning operational state. |
| `free_bike_status.json` | Cond. | Real-time coordinates and battery ranges of dockless/free-floating vehicles. |
| `system_alerts.json` | No | Operational disruption notices, adverse weather, or service suspensions. |
| `vehicle_types.json` | No | Vehicle specifications (`form_factor`: bicycle, scooter, car; `propulsion_type`: human, electric_assist, electric; `max_range_meters`). |
| `system_regions.json` | No | Municipal boundaries / operating zones. |
| `system_pricing_plans.json`| No | Fare structures, unlock fees, per-minute rates. |
| `geofencing_zones.json` | No | GeoJSON zones for speed limits, no-parking, or mandatory parking rules. |

---

## 4. Systems Catalog (`systems.csv`)

MobilityData maintains an official catalog of 1,000+ public systems worldwide:
- **Location:** `systems.csv` in [`MobilityData/gbfs`](https://github.com/MobilityData/gbfs).
- **Columns:** `Country Code`, `Name`, `Location`, `System ID`, `URL`, `Auto-Discovery URL`, `Supported Versions`, `Authentication Type`.
- **Authentication Types:**
  - `0` (or empty): Public, unauthenticated.
  - `1`: API key via URL query parameter (`Authentication Parameter Name`).
  - `2`: API key via HTTP request header.

---

## 5. Using the `gbfs-mcp` Tools

When querying live shared mobility data, use the following MCP tools:

- `gbfs_list_systems`: Search the global catalog by city or country (e.g. `"Minneapolis"`, `"Paris"`, `"NYC"`).
- `gbfs_get_system`: Load feed manifest and operator details from `gbfs.json`.
- `gbfs_get_stations`: Query real-time station availability near coordinates (`lat`, `lon`, `radius_meters`) with distance ranking.
- `gbfs_get_free_bikes`: Query dockless bikes and e-scooters with battery level and remaining range.
- `gbfs_get_alerts`: Fetch active weather or maintenance disruptions.
- `gbfs_get_vehicle_types`: Inspect fleet vehicle models and propulsion types.
