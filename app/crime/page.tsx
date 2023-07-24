import React from "react";
import Link from "next/link";
import { IoMdClose } from "react-icons/io";
import { AiOutlineExpand } from "react-icons/ai";
import { crimeByLocation } from "../footballMap/FootballServerAction";
const Crime = () => {
  return (
    <table className=" text-sm text-left text-gray-500 dark:text-gray-400 w-full">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="px-6 py-3">
            Crime
          </th>
          <th scope="col" className="px-6 py-3">
            Address
          </th>
          <th scope="col" className="px-6 py-3">
            Date
          </th>
          <th scope="col" className="px-6 py-3">
            <div className="flex space-x-2">
              <Link href="crime">
                <AiOutlineExpand size={30} />
              </Link>
              <Link href="/">
                <IoMdClose size={30} />
              </Link>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {popupInfo.map((i) => (
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <td className="px-6 py-4">{i.category}</td>
            <td className="px-6 py-4">{i.location.street.name}</td>
            <td className="px-6 py-4">{i.month}</td>
            <td className="px-6 py-4 text-right">
              <a
                href="#"
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >
                Details
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
export async function getServerSideProps() {}
export default Crime;
