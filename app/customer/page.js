
"use client";
import { useState, useEffect, memo } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";



export default function Home() {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL;
    const [customerList, setCustomerList] = useState([])
    const [editMode, setEditMode] = useState(false)
    const { register, handleSubmit, reset } = useForm()


    async function fetchCustomer() {
        const customerData = await fetch(`${API_BASE}/customer`);
        const customers = await customerData.json();

        const formattedCustomers = customers.map((customer) => {
            customer.id = customer._id
            return customer
        ;
        });
        setCustomerList(formattedCustomers);
    }



    useEffect(() => {
        fetchCustomer();
    }, []);



    const deleteById = (id) => async () => {
        if (!confirm("Are you sure?")) return;

        const response = await fetch(`${API_BASE}/customer/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            alert(`Failed to delete customer: ${response.status}`);
        }
        alert("Customer deleted successfully");
        fetchCustomer();
    };

    //Create+update
    const handleCustomerFormSubmit = (data) => {
        if (editMode) {
            fetch(`${API_BASE}/customer`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }).then(() => {
                stopEditMode();
                fetchCustomer()
            });
            return
        }
        // create new customer
        fetch(`${API_BASE}/customer`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then(() => fetchCustomer());
    };

    function startEditMode(customer) {
        reset(customer)
        setEditMode(true)
    }
    function stopEditMode() {
        reset({
            name: '',
            dateOfBirth: '',
            memberNumber: '',
            interests: ''
        });
        setEditMode(false);

    }


    return (
        <>
            <div className="flex flex-row gap-4">
                <div className="flex-1 w-64 ">
                    <form onSubmit={handleSubmit(handleCustomerFormSubmit)}>
                        <div className="grid grid-cols-2 gap-4 m-4 w-1/2">
                            <div>Name:</div>
                            <div>
                                <input
                                    name="name"
                                    type="text"
                                    {...register("name", { required: true })}
                                    className="border border-black w-full"
                                />
                            </div>
                            <div>Date Of Birth</div>
                            <div>
                                <input
                                    name="name"
                                    type="date"
                                    {...register("dateOfBirth", { required: true })}
                                    className="border border-black w-full"
                                />
                            </div>
                            <div>Member Number:</div>
                            <div>
                                <input
                                    name="memberNumber"
                                    type="number"
                                    {...register("memberNumber", { required: true })}
                                    className="border border-black w-full"
                                />
                            </div>
                            <div>Interests:</div>
                            <div>
                                <textarea
                                    name="interests"
                                    {...register("interests", { required: true })}
                                    className="border border-black w-full"
                                />
                            </div>

                            <div className="col-span-2">
                                {editMode ? (
                                    <input
                                        type="submit"
                                        value="Update"
                                        className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                                    />
                                ) : (
                                    <input
                                        type="submit"
                                        value="Add"
                                        className="bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                                    />
                                )}
                                {editMode && (
                                    <button
                                        onClick={() => {
                                            reset({ name: "", dateOfBirth: "", memberNumber: "", interests: "" });
                                            setEditMode(false);
                                        }}
                                        className="ml-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
                <div className="border m-4 bg-slate-300 flex-1 w-64">
                    <h1 className="text-2xl">Customers ({customerList.length})</h1>
                    <ul className="list-disc ml-8">
                        {customerList.map((p) => (
                            <li key={p._id}>
                                <button
                                    className="border border-black p-1/2"
                                    onClick={() => startEditMode(p)}
                                >
                                    📝
                                </button>{" "}
                                <button className="border border-black p-1/2" onClick={deleteById(p._id)}>
                                    ❌
                                </button>{" "}
                                <Link href={`/customer/${p._id}`} className="font-bold">
                                    {p.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
}

