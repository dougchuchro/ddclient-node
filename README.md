# ddclient-node

A simplified Node.js implementation of the `ddclient` that supports dynamic DNS updates specifically for the Porkbun DNS service.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Modules](#modules)
- [License](#license)

## Features

- Periodically checks the public IP address.
- Updates DNS records on Porkbun when the IP changes.
- Simple configuration using a JSON file.

## Installation

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd ddclient-node
