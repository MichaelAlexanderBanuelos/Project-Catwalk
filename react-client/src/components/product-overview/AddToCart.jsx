import React, { useState, useEffect } from 'react';
import header from '../../../../config.js';
import axios from 'axios';
import Select from 'react-select';

export default function AddToCart({ product, selectedStyle, styles, getStyleName }) {

  const [size, selectSize] = useState('');
  const [qty, selectQty] = useState(1);
  const [qtyOptions, setQtyOptions] = useState([]);
  const [sizeMenuOpen, toggleSizeMenu] = useState(false);
  const [qtyMenuOpen, toggleQtyMenu] = useState(false);
  const [outOfStock, warning] = useState(false);
  const [message, changeMessage] = useState('');

  function getQtyOrEntireSKU(sku = null) {
    // find selected style id in the styles-options array
    for (let option of styles) {
      if (option.style_id === selectedStyle) {
        for (let each in option.skus) {
          // find currently selected size of the style
          if (option.skus[each].size === size) {
            // use that quantity
            return sku ? each : option.skus[each].quantity;
          }
        }
      }
    }
  }

  const getSizeOptions = () => {
    let sizeOptions = [];

    // find selected style id in the styles-options array
    for (let option of styles) {
      if (option.style_id === selectedStyle) {
        // when found, use the size property of the objects in the option's skus array to populate options
        if (Object.keys(option.skus).length) {
          if (outOfStock === true) {
            warning(false);
            changeMessage('');
          }
          for (let each in option.skus) {
            // only sizes that are currently in stock for the style selected should be listed
            if (option.skus[each].quantity > 0) {
              let o = option.skus[each].size
              sizeOptions.push({ value: o, label: o });
            }
          }
        } else {
          if (outOfStock === false) {
            warning(true);
            changeMessage('OUT OF STOCK');
          }
        }
      }
    }
    return sizeOptions
  }

  const getQtyOptions = () => {
    let qtyOptions = getQtyOrEntireSKU()

    // hard limit 15
    if (qtyOptions > 15) {
      qtyOptions = 15
    };

    let options = [];
    for (let i = 1; i <= qtyOptions; i++) {
      options.push({ value: Number(i), label: String(i) })
    }

    setQtyOptions(options);
  }

  const pleaseSelectSize = () => {
    toggleSizeMenu(true);
    changeMessage('Please select a size.')
  }

  const add = () => {
    // If both a valid size and valid quantity are selected: Clicking this button will add the product to the user’s cart.
    if (size === '') {
      pleaseSelectSize();
    } else if (qty > 0) {
      let cart = {
        sku_id: Number(getQtyOrEntireSKU('sku')),
      };
      axios.post('https://app-hrsei-api.herokuapp.com/api/fec2/hr-lax/cart', cart, header)
        .then(() => {
          axios.get('https://app-hrsei-api.herokuapp.com/api/fec2/hr-lax/cart', header)
            .then((result) => {
              console.log('cart:', result.data);
            })
        })
        .catch((err) => {
          console.error(err)
        })
      alert(`Added (${qty}) size ${size} ${product.name} in ${getStyleName()} to cart!`)
    }
  }

  const handleSizeSelect = (sizeOption) => {
    selectSize(sizeOption.value);
    toggleSizeMenu(false);
    changeMessage('');
  }

  useEffect(() => {
    getQtyOptions();
  }, [size])

  const handleQtySelect = (qtyOption) => {
    selectQty(qtyOption.value);
    toggleQtyMenu(false);
  }

  const closeMenus = () => {
    if (sizeMenuOpen) {
      toggleSizeMenu(false)
    }
    if (qtyMenuOpen) {
      toggleQtyMenu(false)
    }
  }

  return (
    <div className='add-to-cart' onBlur={() => closeMenus()}>
      {styles.length && selectedStyle !== 0 && product.hasOwnProperty('id') ?
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className='add-to-cart-message'>{message}</span>
          <div className='selector-container'>
            {/* size dropdown should become inactive and read OUT OF STOCK when there's no stock */}
            <Select
              id='size'
              className='dropdown'
              onFocus={() => toggleSizeMenu(true)}
              blurInputOnSelect={true}
              onChange={handleSizeSelect}
              disabled={outOfStock}
              options={getSizeOptions()}
              placeholder={outOfStock ? 'OUT OF STOCK' : 'SELECT SIZE'}
              menuIsOpen={sizeMenuOpen}
              isSearchable={false}
            >
            </Select>
            <Select
              id='qty'
              className='dropdown'
              onFocus={() => toggleQtyMenu(true)}
              blurInputOnSelect={true}
              onChange={handleQtySelect}
              disabled={size === '' ? true : false}
              options={qtyOptions}
              placeholder={size === '' ? '-' : 1}
            >
            </Select>
          </div>
          <div className='selector-container'>
            {/* add to cart button is hidden when there's no stock */}
            {outOfStock ? null : <button className='add-to-cart-button' onClick={() => add()}><span>ADD TO BAG</span><span>+</span></button>}
            {/* useless */}
            <button className='favorite-button' onClick={() => alert(`FAVORITED ${product.name} !`)}>☆</button>
          </div>
        </div>
        : null}
    </div>
  )
}


