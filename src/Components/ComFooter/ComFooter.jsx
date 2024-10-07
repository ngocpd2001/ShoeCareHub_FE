import React, { useEffect, useState } from 'react';
import { textApp } from '../../../TextContent/textApp'
import { CalendarDaysIcon, HandRaisedIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom';
import { getData } from '../../../api/api';
const ComFooter = () => {
  const [items, setCategory] = useState([]);

  useEffect(() => {
    getData("/category")
      .then((data) => {

        setCategory(data?.data)
      })
  }, []);
  return (
    <div className="relative isolate overflow-hidden bg-gray-900 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
          <div className="max-w-xl lg:max-w-lg">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{textApp.Footer.contact.title}</h2>
            <p className="mt-4 text-lg leading-8 text-gray-300">
              {textApp.Footer.contact.adress}<br />
              {textApp.Footer.contact.email}<br />
              {textApp.Footer.contact.phone}
            </p>
            <div className="mt-6 flex max-w-md gap-x-4">
              <label htmlFor="email-address" className="sr-only">
                {textApp.Footer.send.field}
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                placeholder={textApp.Footer.send.field}
              />
              <button
                type="submit"
                className="flex-none rounded-md bg-[#0F296D]  text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                {textApp.Footer.send.submit}
              </button>
            </div>
          </div>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
            <div className="flex flex-col items-start">
              <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                <CalendarDaysIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <dt className="mt-4 font-semibold text-white">{textApp.Footer.aboutUs.title}</dt>
              <dd className="mt-2 leading-7 text-gray-400">
                <Link to={'/follow'}>Theo dõi</Link><br />
                <Link to={'/product'}>{textApp.Footer.aboutUs.info1}</Link><br />
              
              </dd>
            </div>
            <div className="flex flex-col items-start">
              <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                <HandRaisedIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              {/* <dt className="mt-4 font-semibold text-white">Thông tin sản phẩm</dt> */}
              <dt className="mt-4 font-semibold text-white">Thể loại</dt>
              <dd className="mt-2 leading-7 text-gray-400">
                {
                  items.map((data, index) => (
                    <div key={index}>
                      <Link to={`/category/${data.value}`}> {data.value}</Link><br />
                    </div>
                  ))
                }
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6" aria-hidden="true">
        <div
          className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
    </div>
  );
};

export default ComFooter;
