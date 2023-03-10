import { useEffect, useState } from "react";

import { Header } from "../../components/Header";
import api from "../../services/api";
import { Food } from "../../components/Food";
import { ModalAddFood } from "../../components/ModalAddFood";
import { ModalEditFood } from "../../components/ModalEditFood";
import { FoodsContainer } from "./styles";

interface FoodProps {
  available: boolean;
  id: number;
  image: string;
  name: string;
  description: string;
  price: string;
}

export function Dashboard() {
  const [foods, setFoods] = useState<FoodProps[]>([]);
  const [editingFood, setEditingFood] = useState<any>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    api.get("foodsMirage").then((response) => setFoods(response.data));
  }, []);

  async function handleAddFood(food: FoodProps) {
    try {
      const response = await api.post("/foodsMirage", {
        ...food,
        available: true,
        id: Math.floor(Math.random() * 100)
      });
      setFoods([...foods, response.data.foods]);

    } catch (err) {
      console.log(err);
    }
  }

  async function handleEditFood(food: FoodProps) {
    setEditingFood(food);
    setEditModalOpen(true);
  }

  async function handleUpdateFood(food: FoodProps) {
    try {
      const foodUpdated = await api.put(`/foodsMirage/${editingFood.id}`, {
        ...editingFood,
        ...food,
      });

      const foodsUpdated = foods.map((f) =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foodsMirage/${id}`);

    const foodsFiltered = foods.filter((food) => food.id !== id);

    setFoods(foodsFiltered);
  }

  function toggleModal() {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}