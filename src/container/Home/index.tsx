import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAllItems, updateItem, createItem } from "../../apis/nftItems";
import Card from "../../components/Card/Card";
import Wallet from "../../components/Wallet/Wallet";
import {
  generateUniqueBrowserId,
  uploadFileToS3,
} from "../../utils/commonFunction";
import {
  IEditHandlerItem,
  IItem,
  IItemContent,
  ITEM_TYPES,
  LOADERS,
} from "../../utils/types";
import {
  getWalletBalance,
  makePayment,
  requestWalletConnection,
} from "../../utils/walletConnection";

const Home = () => {
  const [items, setItems] = useState<IItem[]>([]);
  const [loader, setLoader] = React.useState<{
    loading: LOADERS | null;
    options?: { id?: number };
  }>({ loading: null });
  const [selectedItemId, setSelectedItemId] = React.useState<number | null>(
    null
  );
  const [createItemPopup, setCreateItemPopup] = React.useState<Boolean>(false);
  const [accounts, setAccounts] = useState<any[] | null>(null);
  const [walletBalance, setWalletBalance] = useState<{ [key: string]: string }>(
    {}
  );

  useEffect(() => {
    setLoader({ loading: LOADERS.GET_ITEMS });
    getAllItems(ITEM_TYPES.ALL)
      .then((res) => setItems(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoader({ loading: null }));
  }, []);

  const accountChangeHandler = (accounts: any[]) => {
    setAccounts(accounts);
    getWalletBalance(accounts[0])
      .then((balance) =>
        setWalletBalance((preState) => ({
          ...preState,
          [accounts[0]]: balance,
        }))
      )
      .catch((err) => console.error(err));
  };

  const connectWallet = async (afterConnectFucntion?: () => void) => {
    return new Promise((resolve, reject) => {
      !accounts?.length
        ? requestWalletConnection().then((res) => {
            accountChangeHandler(res);
            afterConnectFucntion && afterConnectFucntion();
            return resolve(res);
          })
        : resolve(accounts);
    }).catch((err) => console.error(err));
  };

  window.ethereum.on("accountsChanged", accountChangeHandler);

  const onCardEdit = async (id?: number, data?: Partial<IEditHandlerItem>) => {
    try {
      if (loader.loading === LOADERS.UPDATE_ITEM) return;
      if (!data && id)
        return setSelectedItemId(id === selectedItemId ? null : id);

      if (data && id) {
        const { imageFile, ...restData } = data;
        const updatedData: Partial<IItemContent> = {
          ...restData,
        };
        setLoader({ loading: LOADERS.UPDATE_ITEM, options: { id } });
        if (imageFile) updatedData.image_url = await uploadFileToS3(imageFile);

        const res = await updateItem(id, updatedData);
        const itemsCopy = [...items];
        const index = itemsCopy.findIndex((item) => item.id === id);
        itemsCopy[index] = res.data;
        setItems(itemsCopy);
        setLoader({ loading: null });
        setSelectedItemId(null);
      }
    } catch (error) {
      setLoader({ loading: null });
      console.error("Edit Card Error", error);
    }
  };

  const onCardCreate = async (_?: number, data?: IEditHandlerItem) => {
    if (loader.loading === LOADERS.ADD_ITEM) return;
    if (!data) return setCreateItemPopup(false);

    const { imageFile, ...restData } = data;
    const uniqueBrowserId = generateUniqueBrowserId();
    const createdData: IItemContent = {
      image_url: "",
      created_by: uniqueBrowserId,
      owner: uniqueBrowserId,
      is_open_for_sale: false,
      ...(restData as any),
    };
    setLoader({ loading: LOADERS.ADD_ITEM });
    if (imageFile)
      createdData.image_url = (await uploadFileToS3(imageFile)) as string;

    const res = await createItem(createdData);
    setItems([res.data, ...items]);
    setLoader({ loading: null });
    setCreateItemPopup(false);
  };

  const onCardDelete = async (id: number) => {
    if (loader.loading === LOADERS.UPDATE_ITEM && loader.options?.id === id)
      return;
    setLoader({ loading: LOADERS.UPDATE_ITEM, options: { id } });
    await updateItem(id, { is_active: false });
    const itemsCopy = [...items];
    const index = itemsCopy.findIndex((item) => item.id === id);
    itemsCopy.splice(index, 1);
    setItems(itemsCopy);
    setLoader({ loading: null });
  };

  const changeSellStatusHandler = async (
    id: number,
    isOpenForSale: boolean,
    ethereum_address?: string
  ) => {
    if (!ethereum_address || !accounts?.length) {
      connectWallet().then((res: any) => {
        onCardEdit(id, {
          is_open_for_sale: isOpenForSale,
          ethereum_address: res[0],
        });
      });
      return;
    }

    onCardEdit(id, {
      is_open_for_sale: isOpenForSale,
      ethereum_address: accounts[0],
    });
  };

  const buyItemHandler = async (id: number, item?: IItemContent) => {
    try {
      if (!item || !item.ethereum_address) return;
      if (+item.price > +walletBalance[accounts?.[0]])
        return toast.error("Insufficient Balance");

      if (!accounts?.length) {
        await connectWallet();
      }

      await makePayment(item.ethereum_address, item.price);

      const uniqueBrowserId = generateUniqueBrowserId();
      onCardEdit(id, {
        is_open_for_sale: false,
        owner: uniqueBrowserId,
        ethereum_address: accounts?.[0],
      });
    } catch (error: any) {
      console.error("Buy Item Error", error);
      toast.error(
        `Buy Item Error -->
      ${error?.message ? error.message : error}`,
        {
          className: "overflow-auto",
        }
      );
    }
  };

  return (
    <div className="container">
      {createItemPopup && (
        <Card
          key={"item-create"}
          editHandler={onCardCreate}
          editable
          isLoading={loader.loading === LOADERS.ADD_ITEM}
        />
      )}
      <h1 className="text-center mb-4 text-4xl font-medium leading-tight mt-8 font-sans text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        NFT
      </h1>
      <div className="flex justify-between items-center">
        <button
          style={{ maxWidth: "fit-content" }}
          className="ml-4 w-full max-w-fit px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
          type="button"
          onClick={() => setCreateItemPopup(true)}
        >
          Create
        </button>
        <Wallet
          accounts={accounts}
          connectWallet={connectWallet}
          walletBalance={walletBalance}
        />
      </div>
      {loader.loading === LOADERS.GET_ITEMS && !items.length ? (
        <div className="text-center flex justify-center h-screen items-center">
          <i className="fas fa-circle-notch fa-spin"></i>
        </div>
      ) : (
        <div className="p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-5 gap-x-4 grid-flow-row auto-rows-max">
          {items.map((item) => (
            <Card
              key={`item-${item.id}`}
              item={item}
              editHandler={onCardEdit}
              editable={selectedItemId === item.id}
              isLoading={
                loader.loading === LOADERS.UPDATE_ITEM &&
                loader.options?.id === item.id
              }
              deleteHandler={onCardDelete}
              changeSellStatusHandler={changeSellStatusHandler}
              buyItemHandler={buyItemHandler}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
