import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useState } from "react";

import InputProducto from "../../ui/InputProducto";
import SelectProducto from "../../ui/SelectProducto";
import Input from "../../ui/input/Input";

import { postProductoFn, putProductoFn } from "../../../api/productos.js";
import { useProducto } from "../../../stores/useProducto.js";

import "./styles/producto.css";
import "../../Auth/auth.css";

const FormularioProductos = () => {
  const [isDisabled, setIsDisabled] = useState(false);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit: onSubmitRHF,
    reset,
    formState: { errors },
    setValue,
  } = useForm();

  const queryClient = useQueryClient();

  const { mutate: postProducto } = useMutation({
    mutationFn: postProductoFn,
    onSuccess: () => {
      toast.dismiss();
      toast.success("Entrada guardada");
      reset();
      Swal.fire({
        title: "Éxito",
        text: "Entrada guardada. Será redirigido a la tabla de productos",
        icon: "success",
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: false,
        willClose: () => {
          navigate(-1);
        },
      });
      queryClient.invalidateQueries({
        queryKey: ["productos"],
      });
    },
    onError: (e) => {
      toast.dismiss();
      toast.error(e.message);
    },
  });

  const { mutate: putProducto } = useMutation({
    mutationFn: putProductoFn,
    onSuccess: () => {
      toast.dismiss();
      toast.success("Entrada actualizada");
      Swal.fire({
        title: "Éxito",
        text: "Entrada actualizada. Será redirigido a la tabla de productos",
        icon: "success",
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: false,
        willClose: () => {
          navigate(-1);
        },
      });

      reset();
      clearProductoToEdit();

      queryClient.invalidateQueries({
        queryKey: ["productos"],
      });
    },
    onError: (e) => {
      toast.dismiss();
      toast.error(e.message);
    },
  });
  const { productoToEdit, clearProductoToEdit } = useProducto();

  if (location.pathname === "/agregar-producto" && productoToEdit) {
    clearProductoToEdit();
  }

  if (productoToEdit) {
    setValue("nombre", productoToEdit.nombre);
    setValue("descripcion", productoToEdit.descripcion);
    setValue("categoria", productoToEdit.categoria);
    setValue("preciounitario", productoToEdit.preciounitario);
    setValue("imagen", productoToEdit.imagen);
    setValue("habilitado", productoToEdit.habilitado);
    setValue("agregado", productoToEdit.agregado);
  }

  const handleSubmit = async (data) => {
    if (productoToEdit) {
      const action = await Swal.fire({
        title: "Atención",
        icon: "info",
        html: `¿Estás seguro que deseas editar el producto <b>"${data.nombre}"</b>?`,
        confirmButtonText: "Si, editar",
        cancelButtonText: "No, cancelar",
        showCancelButton: true,
      });

      if (action.isConfirmed) {
        toast.loading("Actualizando entrada...");
        putProducto({ productoId: productoToEdit.id, data });
      }
    } else {
      const action = await Swal.fire({
        title: "Atención",
        icon: "info",
        html: `¿Estás seguro que deseas guardar el nuevo producto <b>"${data.nombre}"</b>?`,
        confirmButtonText: "Si, guardar",
        cancelButtonText: "No, cancelar",
        showCancelButton: true,
      });
      if (action.isConfirmed) {
        toast.loading("Guardando entrada...");
        postProducto(data);
      }
    }
    reset();
  };

  const handleCancelEdit = () => {
    navigate(-1);
    clearProductoToEdit();
    reset();
  };

  const handlePrice = (event) => {
    const value = event.target.value;
    if (value <= 0) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  };

  return (
    <form
      className="container px-0 bg-blue-color form-custom"
      onSubmit={onSubmitRHF(handleSubmit)}
    >
      <h1 className="text-center all-text-color py-2">
        {productoToEdit ? "Editar producto" : "Crear producto"}
      </h1>
      <div className="form-content pt-3 bg-white">
        {productoToEdit && (
          <div className="alert alert-warning">
            Atención: Estás modificando la entrada con nombre{" "}
            <b>{productoToEdit.nombre}</b>
          </div>
        )}
        <div className="row ps-4 pe-4 gap-0">
          <div className="col-12 col-md-6">
            <Input
              className=" border-primary blue-color"
              error={errors.nombre}
              label="Nombre"
              name="nombre"
              options={{
                required: "Este campo es requerido",
                minLength: {
                  value: 3,
                  message: "El nombre debe tener al menos 3 caracteres",
                },
                maxLength: {
                  value: 30,
                  message: "El nombre debe tener como mucho 30 caracteres",
                },
              }}
              placeholder="Milanesa"
              register={register}
              maxLength={30}
            />
          </div>
          <div className="col-12 col-md-6">
            <SelectProducto
              className="mt-3 mb-2"
              error={errors.categoria}
              name="categoria"
              label="Categoria del producto"
              categories={[
                "SANGUCHE",
                "GASEOSA",
                "ADEREZO",
                "VERDURA",
                "PIZZA",
                "HAMBURGUESA",
              ]}
              options={{
                required: "Este campo es requerido",
              }}
              register={register}
            />
          </div>
          <Input
            textarea
            className="mb-3 border-primary blue-color"
            error={errors.descripcion}
            label="Descripcion"
            name="descripcion"
            options={{
              required: "Este campo es requerido",
              minLength: {
                value: 3,
                message: "La descripción debe tener al menos 3 caracteres",
              },
              maxLength: {
                value: 200,
                message: "La descripción debe tener como mucho 200 caracteres",
              },
            }}
            placeholder="Descripción del producto"
            register={register}
            maxLength={200}
          />
          <Input
            className="mb-3 border-primary blue-color"
            type="number"
            error={errors.preciounitario}
            label="Precio unitario"
            name="preciounitario"
            options={{
              required: "Este campo es requerido",
              min: {
                value: 1,
                message: "El precio unitario debe ser mayor que 0",
              },
              validate: {
                greaterThanZero: (value) =>
                  parseFloat(value) > 0 ||
                  "El precio unitario debe ser mayor que 0",
              },
            }}
            register={register}
            min={1}
          />
          <Input
            className="mb-2 pb-2 border-primary blue-color"
            error={errors.imagen}
            label="Imagen"
            name="imagen"
            options={{
              required: "Este campo es requerido",
              minLength: {
                value: 5,
                message:
                  "El enlace a la imagen debe tener al menos 5 caracteres",
              },
              pattern: {
                value:
                  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/,
                message:
                  "El enlace ingresado no es válido, debe ser una URL válida",
              },
            }}
            placeholder="https://google.com"
            register={register}
          />
          <div className="row">
            <div className="col-12 col-md-6 mb-3">
              <Input
                className="mb-3 custom-select border border-secondary"
                type="radio"
                error={errors.habilitado}
                label="¿Está habilitado?"
                name="habilitado"
                options={{
                  required: "Este campo es requerido",
                }}
                radioOptions={[
                  { value: "true", label: "Sí" },
                  { value: "false", label: "No" },
                ]}
                register={register}
              />
            </div>
            <div className="col-12 col-md-6 mb-3">
              <Input
                className="mb-3 custom-select border border-secondary"
                type="radio"
                error={errors.agregado}
                label="¿Es un agregado?"
                name="agregado"
                options={{
                  required: "Este campo es requerido",
                }}
                radioOptions={[
                  { value: "true", label: "Sí" },
                  { value: "false", label: "No" },
                ]}
                register={register}
              />
            </div>
          </div>
          <hr />
          <div className="text-end mb-2">
            {productoToEdit && (
              <button
                className="btn btn-secondary mx-1"
                type="button"
                onClick={handleCancelEdit}
              >
                Cancelar edición
              </button>
            )}
            <button className="btn btn-primary" type="submit">
              Guardar
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
export default FormularioProductos;
