import { notFound } from "next/navigation";
import ProductForm from "../ProductForm";
import { getProductById } from "@/lib/products";
import { deleteProduct } from "../../actions";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(Number(id));
  if (!product) notFound();
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-bold">Edit Product</h1>
        <form action={deleteProduct}>
          <input type="hidden" name="id" value={product.id} />
          <button className="rounded-full border border-red-300 text-red-600 px-4 py-2 text-xs font-bold hover:bg-red-50">Delete Product</button>
        </form>
      </div>
      <ProductForm product={product} />
    </div>
  );
}
