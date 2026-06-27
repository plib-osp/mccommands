<p align="center">
  <a href="https://github.com/plib-osp/mccommands" target="_blank">
    <img src="gh-db/img/banner.png" alt="MCCommands Banner">
  </a>
</p>

**MCCommands** is a comprehensive, version-aware Minecraft command reference platform built for developers, server administrators, and command enthusiasts. It addresses a common pain point in the Minecraft ecosystem: command syntax, permissions, and availability change significantly across game versions, and existing documentation is often fragmented, outdated, or buried in sprawling wiki pages. MCCommands centralizes every command from every version into a single, queryable API and web interface, saving countless hours of manual research.

At its core, MCCommands is powered by a structured dataset that maps each Minecraft command — from the essentials like `/gamemode` and `/tp` to the obscure operator-only utilities — to the specific game versions in which they were introduced, modified, deprecated, or removed. This version-tracking capability is what sets it apart; a single request can tell you not only what a command does, but also whether it's available in the snapshot you're running, what its current syntax looks like, and what permissions are required. This makes it an indispensable tool for modpack maintainers, server owners juggling multiple versions, and tutorial creators who need accurate, version-gated references.

The platform exposes a clean REST API that returns command metadata in a consistent JSON format, making it trivial to integrate into other tools, bots, or dashboards. Whether you are building a Discord bot that looks up commands on the fly, a server management panel that validates commands before execution, or a educational tool that teaches command syntax across different versions, MCCommands provides the reliable backbone you need. The API is designed to be intuitive: endpoints are logically organized around command names, version ranges, and categories, with thoughtful defaults that cover the most common queries while still allowing fine-grained filtering for power users.

Alongside the API, MCCommands includes a lightweight web frontend that makes the same data accessible through a browser. The interface is designed for quick scanning: commands are grouped by category and version, with syntax highlighted for readability and permission nodes clearly displayed. This dual delivery — API and web UI — ensures that the same high-quality data serves both automated workflows and human readers alike, without compromise.

MCCommands is built with Node.js and Express on the backend, using EJS templating for the frontend views. The project is structured for extensibility, with modular routing, service layers for business logic, and environment-aware configuration via dotenv. It is released under the Apache 2.0 license, welcoming both personal and commercial use, and contributions are encouraged to expand the command catalog and improve version coverage.

In short, MCCommands is more than just a command list — it is a version-aware command encyclopedia designed to keep pace with Minecraft's ever-evolving feature set, making it the definitive reference for anyone who works with Minecraft commands at scale.
