import { useState } from "react";
import {Form, redirect, useActionData, useNavigation} from "react-router-dom";
import {createOrder} from "../services/apiRestaurant.ts";
import Button from "../ui/Button.tsx";
import {useSelector} from "react-redux";
import {getCart, clearCart, getTotalCartPrice} from '../../redux/cart/cartSlice'
import EmptyCart from "../cart/EmptyCart";
import store from '../../redux/store'
// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str:string) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );

const fakeCart = [
  {
    pizzaId: 12,
    name: "Mediterranean",
    quantity: 2,
    unitPrice: 16,
    totalPrice: 32,
  },
  {
    pizzaId: 6,
    name: "Vegetale",
    quantity: 1,
    unitPrice: 13,
    totalPrice: 13,
  },
  {
    pizzaId: 11,
    name: "Spinach and Mushroom",
    quantity: 1,
    unitPrice: 15,
    totalPrice: 15,
  },
];

function CreateOrder() {

  const navigation = useNavigation()
  const isSubmitting = navigation.state ==='submitting'
  const  {username} = useSelector((state) => state.user)
  const [withPriority, setWithPriority] = useState(false);

  const totalCartPrice= useSelector(getTotalCartPrice);
  const priorityPrice = withPriority? totalCartPrice * 0.2 :0


  //form errors

  const formErrors  =useActionData()
  //
  const cart = useSelector(getCart)

  if(!cart.length) return <EmptyCart/>
  console.log(cart)

  return (
    <div className='px-4 py-6'>
      <h2 className='mb-8 text-xl font-semibold'>Ready to order? Let's go!</h2>

      <Form method='post'>
        <div className='mb-5   flex gap-2 flex-col sm:flex-row sm:items-center '>
          <label className='sm:basis-40'>First Name</label>
          <input className='input grow' type="text" name="customer" defaultValue={username} required />
        </div>

        <div className='mb-5   flex gap-2 flex-col sm:flex-row sm:items-center '>
          <label className='sm:basis-40'>Phone number</label>
          <div className='grow'>
            <input className='input  w-full' type="tel" name="phone" required />
            {formErrors?.phone && <p className=' bg-red-100 mt-2 tx-xs text-red-700 p-2 rounded-md '>{formErrors.phone}</p>}
          </div>

        </div>

        <div className='mb-5   flex gap-2 flex-col sm:flex-row sm:items-center '>
          <label className='sm:basis-40'>Address</label>
          <div className='grow'>
            <input
                className='input w-full'
                type="text" name="address" required />
          </div>
        </div>

        <div className='mb-12 flex gap-5 items-center'>
          <input
              className='h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2'
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
             onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className='font-medium' >Want to yo give your order priority?</label>
        </div>

        <div>

          <input type='hidden' name='cart' value={JSON.stringify(cart)}/>
          <Button type='primary' disabled={isSubmitting}>{isSubmitting ? 'Placing order ....' : 'Order Now'}</Button>
        </div>
      </Form>
    </div>
  );
}

export const action = async({request}) => {


    const formData = await request.formData();
    const data = Object.fromEntries(formData);


    const order = {
      ...data,
      cart:JSON.parse(data.cart),
      priority:data.priority === 'true'
    }

    console.log(order)

    const errors = {}
  if(!isValidPhone(order.phone)) errors.phone ='Please give us a valid phone number so that we can contact you'
  if(Object.keys(errors).length > 0) return errors;



  const newOrder = await createOrder(order);

  //just a hack
  store.dispatch(clearCart())
    return  redirect(`/order/${newOrder.id}`)
}

export default CreateOrder;
