/*
 * Date: 20/08/2026
 * Name: Cole Zinda/Penglei Fan - Bella
 *
 * File Path: src/components/content/ChefDishManager.tsx
 * Function: Lets chefs create, edit, and delete their menu dishes
 */

import { useState } from "react";
import { ActionButton } from "../ui/ActionButton";
import { useChefDishes, type DishInput } from "../../hooks/useChefDishes";

const emptyDish: DishInput = {
  name: "",
  description: "",
  price: 0,
  category: "",
  image: "/assets/food/pizza.svg",
  rating: 5,
};

export function ChefDishManager() {
  const { dishes, isLoading, error, saveDish, removeDish } = useChefDishes();
  const [form, setForm] = useState<DishInput>(emptyDish);
  const [editingId, setEditingId] = useState<number | undefined>();
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const updateField = (field: keyof DishInput, value: string | number) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const save = async () => {
    setIsSaving(true);
    setMessage("");
    try {
      const dish = await saveDish(form, editingId);
      setMessage(`${dish.name} saved successfully.`);
      setForm(emptyDish);
      setEditingId(undefined);
    } catch (requestError) {
      setMessage(
        requestError instanceof Error
          ? requestError.message
          : "Dish could not be saved.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading)
    return <div className="card data-state">Loading dishes...</div>;
  if (error) return <div className="card data-state error-state">{error}</div>;

  return (
    <div className="chef-dish-manager">
      <div className="card form-card">
        <h2>{editingId ? "Edit dish" : "Add a dish"}</h2>
        <label>
          Dish name
          <input
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
          />
        </label>
        <label>
          Description
          <textarea
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
          />
        </label>
        <div className="payment-fields-row">
          <label>
            Price
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(event) =>
                updateField("price", Number(event.target.value))
              }
            />
          </label>
          <label>
            Category
            <input
              value={form.category}
              onChange={(event) => updateField("category", event.target.value)}
            />
          </label>
        </div>
        {message && (
          <p
            className={
              message.includes("saved successfully")
                ? "success form-message"
                : "error-state form-message"
            }
          >
            {message}
          </p>
        )}
        <div className="actions">
          <ActionButton
            label={
              isSaving
                ? "Saving..."
                : editingId
                  ? "Save changes"
                  : "Create dish"
            }
            disabled={isSaving || !form.name.trim()}
            onClick={() => void save()}
          />
          {editingId && (
            <ActionButton
              label="Cancel"
              onClick={() => {
                setEditingId(undefined);
                setForm(emptyDish);
              }}
            />
          )}
        </div>
      </div>
      <section className="dish-list" aria-label="Your dishes">
        {dishes.map((dish) => (
          <article className="card dish-row" key={dish.id}>
            <div>
              <strong>{dish.name}</strong>
              <span>
                {dish.category} · ${dish.price.toFixed(2)}
              </span>
              <p>{dish.description}</p>
            </div>
            <div className="actions">
              <ActionButton
                label="Edit"
                onClick={() => {
                  setEditingId(dish.id);
                  setForm({
                    name: dish.name,
                    description: dish.description,
                    price: dish.price,
                    category: dish.category,
                    image: dish.image,
                    rating: dish.rating,
                  });
                }}
              />
              <ActionButton
                label="Delete"
                onClick={() => void removeDish(dish.id)}
              />
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
