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
            <div className="flex justify-end space-x-2">
              <Link href="/">
                <IoMdClose size={30} />
              </Link>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
          <td className="px-6 py-4">Robbery</td>
          <td className="px-6 py-4">Argyle street</td>
          <td className="px-6 py-4">2023-07</td>
        </tr>
      </tbody>
    </table>
  );
};

export default Crime;
