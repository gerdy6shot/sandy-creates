import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Store } from './lib/store';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import { Shop, ProductDetail, Cart } from './pages/Shop';
import { Culinary, CulinaryDetail } from './pages/Culinary';
import { Experiences, ExperienceDetail } from './pages/Experiences';
import Contact from './pages/Contact';
import OwnerAdmin, { OwnerLogin } from './pages/OwnerAdmin';
import { CheckoutResult, NotFound, Policies } from './pages/Utility';
export default function App(){return <Store><BrowserRouter><Routes><Route element={<Layout/>}><Route index element={<Home/>}/><Route path="about" element={<About/>}/><Route path="spice-gurl" element={<Shop/>}/><Route path="spice-gurl/products/:slug" element={<ProductDetail/>}/><Route path="culinary" element={<Culinary/>}/><Route path="culinary/:slug" element={<CulinaryDetail/>}/><Route path="experiences" element={<Experiences/>}/><Route path="experiences/:slug" element={<ExperienceDetail/>}/><Route path="contact" element={<Contact/>}/><Route path="cart" element={<Cart/>}/><Route path="checkout/success" element={<CheckoutResult/>}/><Route path="checkout/cancel" element={<CheckoutResult/>}/><Route path="policies/:type" element={<Policies/>}/><Route path="admin/login" element={<OwnerLogin/>}/><Route path="admin/*" element={<OwnerAdmin/>}/><Route path="*" element={<NotFound/>}/></Route></Routes></BrowserRouter></Store>;}
