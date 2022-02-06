/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.sql(`
        INSERT INTO 
        nft_items 
        (title, description, image_url, created_by, owner, price, is_open_for_sale, ethereum_address) 
        VALUES 
        ('NFT_item_1', 'NFT_item_1_description', 'https://picsum.photos/200/300', 'NFT_item_1_created_by', 'NFT_item_1_owner', '49', true, 0xB5d8593C11561CC105db3Da8a1A92D8Bd200199F),
        ('NFT_item_2', 'NFT_item_2_description', 'https://picsum.photos/id/237/200/300', 'NFT_item_2_created_by', 'NFT_item_2_owner', '25', true, 0xB5d8593C11561CC105db3Da8a1A92D8Bd200199F),
        ('NFT_item_3', 'NFT_item_3_description', 'https://picsum.photos/seed/picsum/200/300', 'NFT_item_3_created_by', 'NFT_item_3_owner', '50', false, 0xB5d8593C11561CC105db3Da8a1A92D8Bd200199F),
        ('NFT_item_4', 'NFT_item_4_description', 'https://picsum.photos/200/300?grayscale', 'NFT_item_4_created_by', 'NFT_item_4_owner', '35', true, 0xB5d8593C11561CC105db3Da8a1A92D8Bd200199F),
        ('NFT_item_5', 'NFT_item_5_description', 'https://picsum.photos/200/300/?blur=2', 'NFT_item_5_created_by', 'NFT_item_5_owner', '60', false, 0xB5d8593C11561CC105db3Da8a1A92D8Bd200199F)
    `)
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.sql(`
        DELETE FROM nft_items 
        WHERE id IN (1, 2, 3, 4, 5) 
    `)
}
