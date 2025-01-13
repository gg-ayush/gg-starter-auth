"use client";
import React, { useState, useEffect } from "react";
import { getVirtualCategories } from "@/action/virtualProducts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { virtualProdSchema } from "@/inventorySchema";
import { saveVirtualProd } from "@/action/vp";
import { FileUploaderRegular } from "@uploadcare/react-uploader";

import "@uploadcare/react-uploader/core.css";

interface Category {
  id: string;
  name: string;
}

interface vProduct {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  type: string;
  categoryId: string;
  source?: string;
}

const VirtualForm = () => {
  const uploadkey = process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY;
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<vProduct>({
    resolver: zodResolver(virtualProdSchema),
  });
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategory() {
      try {
        const result = await getVirtualCategories();
        if (result) {
          setCategories(result);
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Failed to fetch category", error);
      }
    }
    fetchCategory();
  }, []);

  const onSubmit = async (data: vProduct) => {
    console.log(data);
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    formData.append("stockQuantity", data.stockQuantity.toString());
    formData.append("type", data.type);
    formData.append("categoryId", data.categoryId);
    if (uploadedUrl) {
      formData.append("source", uploadedUrl);
    }
    console.log("hello");
    try {
      const result = await saveVirtualProd(formData);
      console.log(result);
      if (result.success && result.data) {
        toast.success("Virtual product has been saved successfully!");
        reset();
        router.push("/dashboard/virtualProduct");
      } else {
        console.error("Validation errors:", result.errors);
        toast.warning("Validation errors occurred. Check console for details.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to save virtual product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6 space-y-6"
      >
        <fieldset className="my-1 border border-blue-500 rounded-lg p-4">
          <legend className="text-xl font-bold text-blue-500 px-2">
            Virtual Product Form
          </legend>
          <fieldset className="my-4 border rounded-lg p-4">
            <legend className="text-lg text-blue-500 px-2">Information</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("name")}
                  required
                  className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="price"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Price:
                </label>
                <input
                  type="number"
                  id="price"
                  {...register("price", { valueAsNumber: true })}
                  required
                  min="0"
                  className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.price && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="stockQuantity"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Quantity:
                </label>
                <input
                  type="number"
                  id="stockQuantity"
                  {...register("stockQuantity", { valueAsNumber: true })}
                  required
                  min="0"
                  className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.stockQuantity && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.stockQuantity.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="type"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Type:
                </label>
                <select
                  id="type"
                  {...register("type")}
                  required
                  className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Select a type
                  </option>
                  <option value="emote">Emote</option>
                  <option value="sound">Sound</option>
                  <option value="coin">Coin</option>
                  <option value="other">Other</option>
                </select>
                {errors.type && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.type.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="categoryId"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Category:
                </label>
                <select
                  id="categoryId"
                  {...register("categoryId")}
                  required
                  className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.categoryId.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="source"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Source:
                </label>
                <FileUploaderRegular
                  sourceList="local, url, gdrive"
                  classNameUploader="uc-light"
                  pubkey={`${uploadkey}`}
                  onChange={(event) => {
                    const file = event.successEntries[0];
                    if (file) {
                      setUploadedUrl(file.cdnUrl);
                    }
                  }}
                />
                {errors.source && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.source.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Description:
                </label>
                <textarea
                  id="description"
                  {...register("description")}
                  rows={3}
                  className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full p-2 my-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </fieldset>
      </form>
    </div>
  );
};

export default VirtualForm;