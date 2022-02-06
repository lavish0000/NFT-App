import React, { useRef, useState } from "react";

import { IEditHandlerItem, IItem, IItemContent } from "../../utils/types";

import imagePlaceholder from "../../assests/images/placeholder.jpg";

import "./Card.css";

interface ICardProps {
  item?: IItem;
  editable?: boolean;
  editHandler: (itemId?: number, item?: IEditHandlerItem) => void;
  deleteHandler?: (itemId: number) => void;
  changeSellStatusHandler?: (itemId: number, sellStatus: boolean, ethereumAddress?: string) => void;
  buyItemHandler?: (itemId: number, item?: IItemContent) => void;
  isLoading?: boolean;
}

const btn_primary =
  "hover:bg-purple-600 hover:text-white border-purple-200 text-purple-600 focus:ring-2 focus:ring-purple-600 focus:ring-offset-2";
const btn_success =
  "hover:bg-green-600 hover:text-white border-green-200 text-green-600 focus:ring-2 focus:ring-green-600 focus:ring-offset-2";
const btn_danger =
  "hover:bg-red-600 hover:text-white border-red-200 text-red-600 focus:ring-2 focus:ring-red-600 focus:ring-offset-2";

const Card: React.FC<ICardProps> = ({
  item,
  isLoading,
  editable,
  editHandler,
  deleteHandler,
  changeSellStatusHandler,
  buyItemHandler,
}) => {
  const {
    id,
    image_url,
    title,
    description,
    price,
    is_owner,
    is_open_for_sale,
    ethereum_address,
  } = item || {};

  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const priceInputRef = useRef<HTMLInputElement | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const [hasError, setHasError] = useState<boolean>(() =>
    item ? false : true
  );
  const [imageInput, setImageInput] = useState<FileList | null>(null);

  const onInputChange = (_: React.FormEvent<HTMLInputElement>) => {
    if (
      priceInputRef.current &&
      (!priceInputRef.current.value || isNaN(+priceInputRef.current.value))
    )
      return setHasError(true);

    if (titleInputRef.current && !titleInputRef.current.value)
      return setHasError(true);

    if (
      imageInputRef.current &&
      (!imageInputRef.current.files || !imageInputRef.current.files.length) &&
      !image_url
    )
      return setHasError(true);

    setHasError(false);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {} as IEditHandlerItem;
    if (titleInputRef.current) payload["title"] = titleInputRef.current.value;
    if (priceInputRef.current) payload["price"] = priceInputRef.current.value;
    if (textAreaRef.current) payload["description"] = textAreaRef.current.value;
    if (imageInputRef.current && imageInputRef.current.files?.length)
      payload["imageFile"] = imageInputRef.current.files[0];

    editHandler(id, payload);
  };

  const buyAndSellButtonHandler = () => {
      if (is_owner && id) return changeSellStatusHandler && changeSellStatusHandler(id, !is_open_for_sale, ethereum_address);
      if (id) return buyItemHandler && buyItemHandler(id, item);
  };

  return (
    <>
      {editable && (
        <div className="backdrop" onClick={() => editHandler(id)}></div>
      )}
      <div
        className={`card rounded overflow-hidden hover:shadow-lg bg-white ${
          editable ? "editable-card" : ""
        }`}
      >
        <img
          className="w-full object-cover ml-auto mr-auto"
          src={
            imageInput?.length
              ? URL.createObjectURL(imageInput[0])
              : image_url || imagePlaceholder
          }
          alt={title}
        />

        <form onSubmit={onSubmit}>
          {editable && (
            <div className="block text-center my-2">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                ref={imageInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length) {
                    setImageInput(e!.target.files);
                    onInputChange(e);
                  }
                }}
              />
              <button
                style={{ maxWidth: "fit-content" }}
                className="ml-4 w-full max-w-fit px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
                onClick={() => imageInputRef.current?.click()}
                type="button"
              >
                {imageInput && imageInput.length ? "Change" : "Upload"}
              </button>
            </div>
          )}

          <div className="px-6 py-4">
            <div className="flex justify-between items-center mb-2">
              {!editable && (
                <>
                  <i
                    className={`fas fa-trash cursor-pointer hover:text-gray-500 ${
                      isLoading ? "text-gray-400" : ""
                    }`}
                    onClick={() => deleteHandler && id && deleteHandler(id)}
                  ></i>
                  <i
                    className={`fas fa-pencil-alt cursor-pointer hover:text-gray-500 ${
                      isLoading ? "text-gray-400" : ""
                    }`}
                    onClick={() => editHandler(id)}
                  ></i>
                </>
              )}
            </div>

            {editable ? (
              <>
                <label className="text-base text-gray-500" htmlFor="title">
                  Title
                </label>
                <input
                  name="title"
                  defaultValue={title}
                  className={`px-3 py-2 w-full bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none block rounded-md sm:text-sm focus:ring-1 mb-2 focus:border-sky-500 focus:ring-sky-500`}
                  placeholder="Enter title"
                  onChange={onInputChange}
                  ref={titleInputRef}
                />
              </>
            ) : (
              <div className="flex justify-between">
                <div className="title font-bold text-xl mb-2">{title}</div>
                {!!is_owner && (
                  <div className="text-gray-500 text-sm">Owned</div>
                )}
              </div>
            )}

            {editable ? (
              <div className="mb-2">
                <label className="text-base text-gray-500" htmlFor="price">
                  Price
                </label>
                <br />
                <input
                  name="price"
                  defaultValue={price}
                  className={`px-3 py-2 w-full bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1 focus:border-sky-500 focus:ring-sky-500`}
                  placeholder="Enter price"
                  onChange={onInputChange}
                  ref={priceInputRef}
                  required
                />
              </div>
            ) : (
              <div className="flex justify-between items-center mb-2">
                <div className="price font-normal text-gray-500 text-sm">
                  Price: {price} ETH
                </div>

                {!editable && (
                  <button
                    style={{ maxWidth: "fit-content" }}
                    className={
                      "ml-4 w-full max-w-fit px-4 py-1 text-sm  font-semibold rounded-full border    hover:border-transparent focus:outline-none " +
                      (!is_owner
                        ? btn_primary
                        : is_open_for_sale
                        ? btn_success
                        : btn_danger)
                    }
                    type="button"
                    disabled={isLoading}
                    onClick={buyAndSellButtonHandler}
                  >
                    {is_owner ? (is_open_for_sale ? "Open For Sale" : "Close For Sale") : "Buy"}
                  </button>
                )}
              </div>
            )}

            {editable ? (
              <>
                <label
                  className="text-base text-gray-500"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  name="description"
                  className="
                    form-control
                    block
                    w-full
                    px-3
                    py-1.5
                    text-base
                    font-normal
                    text-gray-700
                    bg-white bg-clip-padding
                    border border-solid border-gray-300
                    rounded
                    transition
                    ease-in-out
                    m-0
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  placeholder="Enter description"
                  defaultValue={description}
                  ref={textAreaRef}
                ></textarea>
              </>
            ) : (
              <p className="description text-gray-700 text-base break-words text-clip">
                {description}
              </p>
            )}
          </div>

          {editable && (
            <div className="flex justify-around mb-6">
              <button
                className="w-24 max-w-fit px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
                onClick={() => editHandler(id)}
                type="button"
                disabled={isLoading}
              >
                Cancle
              </button>
              <button
                className={`w-24 max-w-fit px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 ${
                  hasError ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={hasError || isLoading}
                type="submit"
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default Card;
