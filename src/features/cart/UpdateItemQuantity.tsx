import React from 'react'
import Button from "../ui/Button";
import {useDispatch} from "react-redux";

import {increaseItemQuantity,
    decreaseItemQuantity} from '../../redux/cart/cartSlice'

const UpdateItemQuantity = ({pizzaId, currentQuantity}) => {
    const dispatch = useDispatch()
    return (
      <div className='flex items-center gap-1 md:gap-3'>

          <Button onClick={() => dispatch(decreaseItemQuantity(pizzaId))}type='round'>-</Button>

         <span className='text-sm font-medium'>
              {currentQuantity}

         </span>
          <Button onClick={() => dispatch(increaseItemQuantity(pizzaId))}type='round'>+</Button>
      </div>
    )
}
export default UpdateItemQuantity
