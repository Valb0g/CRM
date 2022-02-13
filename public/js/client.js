/* eslint-disable no-plusplus */
/* eslint-disable max-len */
const btn = document.querySelectorAll('.btnDeleteClient');
for (let i = 0; i < btn.length; i++) {
  btn[i].addEventListener('click', async (e) => {
    e.preventDefault();

    const { divid } = e.target.dataset;
    await fetch(`/clients/${divid}`, {
      method: 'DELETE',
    });
    e.target.parentNode.parentNode.remove();
  });
}

const btnOrd = document.querySelectorAll('.btnDeleteOrder');
for (let i = 0; i < btnOrd.length; i++) {
  btnOrd[i].addEventListener('click', async (e) => {
    e.preventDefault();

    const { divid } = e.target.dataset;
    await fetch(`/clients/basket/${divid}`, {
      method: 'DELETE',
    });
    e.target.parentNode.parentNode.remove();
  });
}

if (document.querySelector('#changeForm')) {
  const clientUpdate = document.querySelector('#changeForm');
  clientUpdate.addEventListener('submit', async (e) => {
    e.preventDefault();

    const userData = { name: clientUpdate.name.value, adress: clientUpdate.adress.value, comments: clientUpdate.comments.value };
    const { divid } = clientUpdate.dataset;
    await fetch(`/clients/${divid}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    window.location.assign('/clients');
  });
}

if (document.getElementById('changeFormBasket')) {
  const orderUpdate = document.getElementById('changeFormBasket');
  orderUpdate.addEventListener('submit', async (e) => {
    e.preventDefault();

    const orderData = {
      orderNumber: orderUpdate.orderNumber.value,
      type: orderUpdate.type.value,
      price: orderUpdate.price.value,
      comments: orderUpdate.comments.value,
      deliveryDate: orderUpdate.deliveryDate.value,
      setupDate: orderUpdate.setupDate.value,
      courierTeam: orderUpdate.courierTeam.value,
      setupTeam: orderUpdate.setupTeam.value,
      status: orderUpdate.status.value,
    };
    const { divid } = orderUpdate.dataset;
    const respon = await fetch(`/clients/basket/change/${divid}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const result = await respon.json();

    window.location.assign(`/clients/${result.superId}`);
  });
}

if (document.getElementById('clientSearch')) {
  const clientSearch = document.getElementById('clientSearch');
  clientSearch.addEventListener('submit', async (e) => {
    e.preventDefault();
    const searchData = { text: e.target.clientSearch.value, select: e.target.clientSelect.value };

    const respon = await fetch('/clients/search', {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(searchData),
    });
    const result = await respon.json();
    window.location.assign(`/clients/search?text=${result.text}&select=${result.select}`);
  });
}

if (document.getElementById('orderSearch')) {
  const orderSearch = document.getElementById('orderSearch');
  orderSearch.addEventListener('submit', async (e) => {
    e.preventDefault();
    const searchData = { text: e.target.orderSearch.value, select: e.target.orderSelect.value };

    const respon = await fetch('/clients/search_order', {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(searchData),
    });
    const result = await respon.json();
    window.location.assign(`/clients/search_order?text=${result.text}&select=${result.select}`);
  });
}
