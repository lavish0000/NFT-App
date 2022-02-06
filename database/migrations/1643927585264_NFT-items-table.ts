/* eslint-disable camelcase */

import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("nft_items", {
        id: {
            type: "id",
            primaryKey: true,
        },
        title: {
            type: "varchar(1000)",
            notNull: true
        },
        description: {
            type: "text",
            notNull: false,
        },
        image_url: {
            type: "varchar(1000)",
            notNull: false,
        },
        created_by: {
            type: "varchar(1000)",
            notNull: true,
        },
        owner: {
            type: "varchar(1000)",
            notNull: true,
        },
        price: {
            type: "varchar(1000)",
            notNull: true,
        },
        is_open_for_sale: {
            type: "boolean",
            notNull: true,
            default: false
        },
        ethereum_address: {
            type: "varchar(1000)",
            notNull: false,
        },
        is_active: {
            type: "boolean",
            notNull: true,
            default: true
        },
        created_at: {
            type: "timestamp",
            notNull: true,
            default: pgm.func("current_timestamp")
        },
        updated_at: {
            type: "timestamp",
            notNull: true,
            default: pgm.func("current_timestamp")

        }
    })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable("nft_items");
};
