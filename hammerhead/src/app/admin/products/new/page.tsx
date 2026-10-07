import ProductForm from "../ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-display text-2xl sm:text-3xl font-bold mb-6">Add New Product</h1>
      <ProductForm />
    </div>
  );
}
