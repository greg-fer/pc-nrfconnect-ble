/*
 * Copyright (c) 2022 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { existsSync, readFileSync } from 'fs';
import { homedir } from 'os';
import { dirname, join, resolve } from 'path';

export const urlBase =
    'https://github.com/NordicPlayground/pc-nrfconnect-ble-standalone/releases/download/v3.10.1/';

const common = 'nrfconnect-bluetooth-le';

export function getProgramPath() {
    const path = programPath();
    return path && existsSync(path) ? path : undefined;
}

function programPath() {
    // Check for the execPath file in the shared folder.
    const desktopDataPath = configDirectory();
    const execPath = join(desktopDataPath, 'execPath');

    if (existsSync(execPath)) {
        return readFileSync(execPath, { encoding: 'utf8', flag: 'r' });
    }

    const directory = programDirectory();

    if (process.platform === 'win32') {
        return resolve(directory, 'nRF Connect for Desktop BLE.exe');
    }

    if (process.platform === 'darwin') {
        return directory;
    }

    if (process.platform === 'linux') {
        return resolve(
            directory,
            'nrfconnect-bluetooth-le-3.10.1-x86_64.AppImage'
        );
    }

    throw new Error(
        `No suitable home directory found for platform: ${process.platform}`
    );
}

export function programDirectory() {
    // Check for the execPath file in the shared folder.
    const desktopDataPath = configDirectory();
    const execPath = join(desktopDataPath, 'execPath');

    if (existsSync(execPath)) {
        return dirname(readFileSync(execPath, { encoding: 'utf8', flag: 'r' }));
    }

    if (process.platform === 'win32') {
        return resolve(homedir(), 'AppData', 'Local', 'Programs', common);
    }

    if (process.platform === 'darwin') {
        return '/Applications/nRF Connect for Desktop BLE.app/Contents/MacOS/nRF Connect for Desktop BLE';
    }

    if (process.platform === 'linux') {
        return resolve(homedir(), 'opt', common);
    }

    throw new Error(
        `No suitable home directory found for platform: ${process.platform}`
    );
}

function configDirectory(): string {
    return (
        // Windows
        join(homedir(), 'APPDATA', 'Roaming', common),
        // macOS
        join(homedir(), 'Library', 'Application Support', common),
        // Linux
        join(homedir(), '.config', common)
    );
}
