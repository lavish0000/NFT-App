import { executeQuery } from '../../DB/sqlLib';
import { dynamicObjectInterface } from '../../util/types';

export const addNFTItemService = function (opts: dynamicObjectInterface = {}) {
  const query = `
        INSERT 
        INTO nft_items 
        (title, description, image_url, created_by, owner, price, is_open_for_sale)
        VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING *`;

  const params = [
    opts.title,
    opts.description,
    opts.image_url,
    opts.created_by,
    opts.owner,
    opts.price,
    opts.is_open_for_sale,
  ];

  return executeQuery('Add NFT Items', query, params);
};

export const getAllNFTItemsService = function (unique_browser_id: string) {
  const query = `
        SELECT 
        id,
        title,
        description,
        image_url,
        price,
        is_open_for_sale,
        is_active,
        ethereum_address,
        created_at,
        updated_at,
        CASE owner 
             WHEN '${unique_browser_id}' THEN 1
             ELSE 0 END 
             AS is_owner 
        FROM nft_items 
        WHERE 
             (is_open_for_sale = true OR owner = $1) 
             AND 
             is_active = true 
             ORDER BY id DESC`;

  const params = [unique_browser_id];

  return executeQuery('Get All nft_items', query, params);
};

export const getNFTItemByIdService = function (id: number) {
  const query = `SELECT * FROM nft_items WHERE id = $1`;
  const params = [id];

  return executeQuery('Get NFT_item by ID', query, params);
};

export const updateNFTItemService = function (
  opts: dynamicObjectInterface = {},
) {
  const query = `
        UPDATE nft_items 
        SET 
           title = $1, 
           description = $2, 
           image_url = $3, 
           created_by = $4, 
           owner = $5, 
           price = $6, 
           is_open_for_sale = $7, 
           is_active = $8,
           ethereum_address = $9
        WHERE id = $10 
        RETURNING *`;

  const params = [
    opts.title,
    opts.description,
    opts.image_url,
    opts.created_by,
    opts.owner,
    opts.price,
    opts.is_open_for_sale,
    opts.is_active,
    opts.ethereum_address,
    opts.id,
  ];

  return executeQuery('Update NFT_item', query, params);
};
