import { useEffect, useState } from "react";
import { getData } from "../../../api/api";
import { ComLink } from "../../Components/ComLink/ComLink"; import { textApp } from "../../../TextContent/textApp";
import images from "../../../img";


export default function ComProducts({ text, link, getAll }) {
    const [products, setProducts] = useState([])
    useEffect(() => {
        getData(link)
            .then((data) => {
                setProducts(data.data.docs)
            })
            .catch((error) => {
                console.error("Error fetching items:", error);
            });
    }, [link]);
    function formatCurrency(number) {
        // Sử dụng hàm toLocaleString() để định dạng số thành chuỗi với ngăn cách hàng nghìn và mặc định là USD.
        return number.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
        });
    }
    function discount(initialPrice, discountedPrice) {
        if (initialPrice <= 0 || discountedPrice <= 0) {
            return "Giá không hợp lệ";
        }

        let discountPercentage = ((initialPrice - discountedPrice) / initialPrice) * 100;
        if (discountPercentage.toFixed(0) > 99) {
            return 99
        } else {

            return discountPercentage.toFixed(0); // Giữ nguyên số thập phân, không rút gọn
        }
    }

    return (
        <>
            <div className="bg-white p-4">
                <div className=" mx-auto  max-w-2xl px-4 py-4 sm:px-6 sm:py-4  lg:max-w-7xl lg:px-2">
                    <h2 className="bg-red-500 h-12 flex items-center p-2 text-2xl font-bold tracking-tight text-white mb-4">{text}</h2>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                        {products?.map((product, index) => (
                            index !== 8 ? <ComLink key={index} to={`/product/${product._id}`} className="shadow-md  border-solid border-2 border-white hover:border-zinc-400">
                                <div className="relative  h-80 overflow-hidden bg-gray-200 xl:aspect-h-8 xl:aspect-w-7 border-solid border-2 border-stone-100">
                                    <img
                                        src={product.image}
                                        alt={product.imageAlt}
                                        className="w-full h-full object-cover object-center lg:h-full lg:w-full  absolute "
                                    />
                                    <div className="relative w-14 h-14 mt-2 ml-2 flex justify-center items-center">
                                        <img
                                            src={images.discount}
                                            alt={product.imageAlt}
                                            className="w-14 h-14 object-cover object-center absolute"
                                        />
                                        <span className="absolute text-white">-{discount(product.price, product.reducedPrice)}%</span>
                                    </div>
                                </div>
                                <h3 className="mt-4 text-base h-12 ml-2 mr-2 text-gray-700 line-clamp-2">{product.name}</h3>
                                <div className="">
                                        <p className="mt-1 ml-2  text-sm font-medium line-through text-slate-500">{formatCurrency(product.price)}</p>
                                    <div className="flex justify-between">
                                    <p className="ml-2 pb-4 text-2xl font-medium  text-red-600">{formatCurrency(product.reducedPrice)}</p>
                                        <p className="mt-1 mr-2  text-sm font-medium ">Đã bán: {(product.sold)}</p>
                                    </div>
                                </div>
                            </ComLink> :
                                <ComLink key={index} to={`/product/${product._id}`} className="shadow-md group border-solid border-2 border-white hover:border-zinc-400 sm:hidden lg:block xl:hidden ">
                                    <div className="relative aspect-h-1 aspect-w-1 h-80 overflow-hidden bg-gray-200 xl:aspect-h-8 xl:aspect-w-7 border-solid border-2 border-stone-100">
                                        <img
                                            src={product.image}
                                            alt={product.imageAlt}
                                            className="w-full h-full object-cover object-center lg:h-full lg:w-full  absolute "
                                        />
                                        <div className="relative w-14 h-14 mt-2 ml-2 flex justify-center items-center">
                                            <img
                                                src={images.discount}
                                                alt={product.imageAlt}
                                                className="w-14 h-14 object-cover object-center absolute"
                                            />
                                            <span className="absolute text-white">-{discount(product.price, product.reducedPrice)}%</span>
                                        </div>
                                    </div>
                                    <h3 className="mt-4 text-base h-12 ml-2 mr-2 text-gray-700 line-clamp-2">{product.name}</h3>
                                    <div className="">
                                        <p className="mt-1 ml-2  text-sm font-medium line-through text-slate-500">{formatCurrency(product.price)}</p>
                                        <div className="flex justify-between">
                                            <p className="ml-2 text-2xl font-medium  text-red-600 pb-4">{formatCurrency(product.reducedPrice)}</p>
                                            <p className="mt-1 mr-2  text-sm font-medium ">Đã bán: {(product.sold)}</p>
                                        </div>
                                    </div>
                                </ComLink>

                        ))}
                    </div>
                    <div className={'flex justify-end mt-4'}>
                        <ComLink to={getAll} >
                            {textApp.Home.getAll}
                        </ComLink>
                    </div>
                </div>
            </div>
        </>
    )
}