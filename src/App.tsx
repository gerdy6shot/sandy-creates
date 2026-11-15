import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
import { Store } from './lib/store';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import { Shop, ProductDetail } from './pages/Shop';
import { Culinary, CulinaryDetail } from './pages/Culinary';
import Contact from './pages/Contact';
import OwnerAdmin, { OwnerLogin } from './pages/OwnerAdmin';
import { NotFound, Policies } from './pages/Utility';
function LegacyExperienceRedirect(){const {slug}=useParams();return <Navigate replace to={slug?`/about#gathering-${slug}`:'/about#gatherings'}/>;}
export default function App(){return <Store><BrowserRouter><Routes><Route element={<Layout/>}><Route index element={<Home/>}/><Route path="about" element={<About/>}/><Route path="spice-gurl" element={<Shop/>}/><Route path="spice-gurl/products/:slug" element={<ProductDetail/>}/><Route path="culinary" element={<Culinary/>}/><Route path="culinary/:slug" element={<CulinaryDetail/>}/><Route path="experiences" element={<Navigate to="/about" replace/>}/><Route path="experiences/:slug" element={<LegacyExperienceRedirect/>}/><Route path="contact" element={<Contact/>}/><Route path="cart" element={<Navigate to="/spice-gurl#preorder-storefront" replace/>}/><Route path="checkout/success" element={<Navigate to="/spice-gurl#preorder-storefront" replace/>}/><Route path="checkout/cancel" element={<Navigate to="/spice-gurl#preorder-storefront" replace/>}/><Route path="policies/:type" element={<Policies/>}/><Route path="admin/login" element={<OwnerLogin/>}/><Route path="admin/*" element={<OwnerAdmin/>}/><Route path="*" element={<NotFound/>}/></Route></Routes></BrowserRouter></Store>;}
