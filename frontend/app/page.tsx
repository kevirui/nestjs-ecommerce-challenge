"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Bell,
  Package,
  CheckCircle,
  Trash2,
  Zap,
  RefreshCw,
  UserPlus,
  Power,
  PlusCircle,
  X,
  ShoppingBag,
  Activity,
  Loader2,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────
interface ServerEvent {
  type: string;
  data: Record<string, unknown>;
  timestamp: string;
}

interface Product {
  id: number;
  title: string | null;
  code: string | null;
  description: string | null;
  isActive: boolean;
  categoryId: number | null;
  merchantId: number | null;
  createdAt: string;
  updatedAt: string;
}

type ConnectionStatus = "connecting" | "connected" | "error";

// ─── Constants ──────────────────────────────────────
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// ─── Main Component ─────────────────────────────────
export default function Home() {
  const [events, setEvents] = useState<ServerEvent[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Form states
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [authToken, setAuthToken] = useState<string | null>(null);

  const [showCreateProductForm, setShowCreateProductForm] = useState(false);
  const [productCategoryId, setProductCategoryId] = useState("1");

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // ─── Fetch products from REST API ──────────────────
  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch(`${API_URL}/product`);
      if (res.ok) {
        const json = await res.json();
        setProducts(json.data ?? json);
      }
    } catch {
      console.error("Failed to fetch products");
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  // ─── Toast helper ──────────────────────────────────
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ─── SSE connection ────────────────────────────────
  useEffect(() => {
    const eventSource = new EventSource(`${API_URL}/realtime/sse`);

    eventSource.onopen = () => setStatus("connected");
    eventSource.onerror = () => setStatus("error");

    const eventTypes = [
      "product.created",
      "product.activated",
      "product.deleted",
      "user.registered",
    ];

    eventTypes.forEach((type) => {
      eventSource.addEventListener(type, (event: MessageEvent) => {
        const payload = JSON.parse(event.data);
        const newEvent: ServerEvent = {
          type,
          data: payload,
          timestamp: new Date().toLocaleTimeString(),
        };
        setEvents((prev) => [newEvent, ...prev].slice(0, 15));

        // Auto-refresh products on product events
        if (type.startsWith("product.")) {
          fetchProducts();
        }
      });
    });

    return () => eventSource.close();
  }, [fetchProducts]);

  // ─── Initial data load ─────────────────────────────
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ─── Action handlers ──────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading("register");
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registerEmail,
          password: registerPassword,
        }),
      });
      const json = await res.json();
      if (res.ok) {
        showToast(`Usuario ${registerEmail} registrado exitosamente`, "success");
        setRegisterEmail("");
        setRegisterPassword("");
        setShowRegisterForm(false);
      } else {
        showToast(json.message || "Error al registrar", "error");
      }
    } catch {
      showToast("Error de conexión con el servidor", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading("login");
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });
      const json = await res.json();
      if (res.ok) {
        const token = json.data?.accessToken ?? json.accessToken;
        setAuthToken(token);
        showToast("Sesión iniciada exitosamente", "success");
        setLoginEmail("");
        setLoginPassword("");
        setShowLoginForm(false);
      } else {
        showToast(json.message || "Credenciales inválidas", "error");
      }
    } catch {
      showToast("Error de conexión con el servidor", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) {
      showToast("Debes iniciar sesión primero", "error");
      return;
    }
    setActionLoading("createProduct");
    try {
      const res = await fetch(`${API_URL}/product/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ categoryId: Number(productCategoryId) }),
      });
      const json = await res.json();
      if (res.ok) {
        showToast("Producto creado exitosamente", "success");
        setShowCreateProductForm(false);
      } else {
        showToast(json.message || "Error al crear producto", "error");
      }
    } catch {
      showToast("Error de conexión con el servidor", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleActivateProduct = async (productId: number) => {
    if (!authToken) {
      showToast("Debes iniciar sesión primero", "error");
      return;
    }
    setActionLoading(`activate-${productId}`);
    try {
      const res = await fetch(`${API_URL}/product/${productId}/activate`, {
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const json = await res.json();
      if (res.ok) {
        showToast(`Producto #${productId} activado`, "success");
      } else {
        showToast(json.message || "Error al activar producto", "error");
      }
    } catch {
      showToast("Error de conexión con el servidor", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!authToken) {
      showToast("Debes iniciar sesión primero", "error");
      return;
    }
    setActionLoading(`delete-${productId}`);
    try {
      const res = await fetch(`${API_URL}/product/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const json = await res.json();
      if (res.ok) {
        showToast(`Producto #${productId} eliminado`, "success");
      } else {
        showToast(json.message || "Error al eliminar producto", "error");
      }
    } catch {
      showToast("Error de conexión con el servidor", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // ─── Helpers ───────────────────────────────────────
  const getEventIcon = (type: string) => {
    switch (type) {
      case "product.created":
        return <Package className="text-blue-400" size={18} />;
      case "product.activated":
        return <CheckCircle className="text-emerald-400" size={18} />;
      case "product.deleted":
        return <Trash2 className="text-red-400" size={18} />;
      case "user.registered":
        return <Zap className="text-amber-400" size={18} />;
      default:
        return <Bell className="text-slate-400" size={18} />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "product.created":
        return "border-blue-500/30 bg-blue-500/5";
      case "product.activated":
        return "border-emerald-500/30 bg-emerald-500/5";
      case "product.deleted":
        return "border-red-500/30 bg-red-500/5";
      case "user.registered":
        return "border-amber-500/30 bg-amber-500/5";
      default:
        return "border-slate-700 bg-slate-800/50";
    }
  };

  // ─── Render ────────────────────────────────────────
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 font-sans">
      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-2xl border backdrop-blur-md transition-all duration-300 ${
            toast.type === "success"
              ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
              : "bg-red-500/15 border-red-500/40 text-red-300"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <header className="border-b border-slate-800/50 bg-slate-900/30 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl">
              <ShoppingBag className="text-white" size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                E-Commerce Dashboard
              </h1>
              <p className="text-xs text-slate-500">
                Real-time monitoring & management
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {authToken && (
              <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                Autenticado
              </span>
            )}
            <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50">
              <span
                className={`h-2 w-2 rounded-full ${
                  status === "connected"
                    ? "bg-emerald-500 animate-pulse"
                    : status === "connecting"
                    ? "bg-amber-500 animate-pulse"
                    : "bg-red-500"
                }`}
              />
              <span className="text-xs text-slate-400 capitalize">
                SSE: {status}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Action bar */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-3">
            {!authToken ? (
              <>
                <button
                  onClick={() => {
                    setShowRegisterForm(!showRegisterForm);
                    setShowLoginForm(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/30 rounded-xl text-amber-300 text-sm font-medium transition-all duration-200 cursor-pointer"
                >
                  <UserPlus size={16} />
                  Registrar Usuario
                </button>
                <button
                  onClick={() => {
                    setShowLoginForm(!showLoginForm);
                    setShowRegisterForm(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30 border border-blue-500/30 rounded-xl text-blue-300 text-sm font-medium transition-all duration-200 cursor-pointer"
                >
                  <Zap size={16} />
                  Iniciar Sesión
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowCreateProductForm(!showCreateProductForm)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 border border-blue-500/30 rounded-xl text-blue-300 text-sm font-medium transition-all duration-200 cursor-pointer"
                >
                  <PlusCircle size={16} />
                  Crear Producto
                </button>
                <button
                  onClick={() => {
                    setAuthToken(null);
                    showToast("Sesión cerrada", "success");
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-xl text-slate-400 text-sm font-medium transition-all duration-200 cursor-pointer"
                >
                  <X size={16} />
                  Cerrar Sesión
                </button>
              </>
            )}
            <button
              onClick={fetchProducts}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-xl text-slate-400 text-sm font-medium transition-all duration-200 ml-auto cursor-pointer"
            >
              <RefreshCw
                size={16}
                className={loadingProducts ? "animate-spin" : ""}
              />
              Refrescar
            </button>
          </div>

          {/* Register form */}
          {showRegisterForm && (
            <form
              onSubmit={handleRegister}
              className="mt-4 p-5 bg-slate-900/70 border border-amber-500/20 rounded-2xl max-w-md"
            >
              <h3 className="text-sm font-semibold text-amber-300 mb-3">
                Registrar nuevo usuario
              </h3>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:border-amber-500/50 focus:outline-none transition-colors"
                />
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:border-amber-500/50 focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={actionLoading === "register"}
                  className="w-full py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 rounded-lg text-amber-300 text-sm font-medium transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  {actionLoading === "register" ? (
                    <Loader2 className="animate-spin mx-auto" size={16} />
                  ) : (
                    "Registrar"
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Login form */}
          {showLoginForm && (
            <form
              onSubmit={handleLogin}
              className="mt-4 p-5 bg-slate-900/70 border border-blue-500/20 rounded-2xl max-w-md"
            >
              <h3 className="text-sm font-semibold text-blue-300 mb-3">
                Iniciar sesión
              </h3>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:border-blue-500/50 focus:outline-none transition-colors"
                />
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:border-blue-500/50 focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={actionLoading === "login"}
                  className="w-full py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-300 text-sm font-medium transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  {actionLoading === "login" ? (
                    <Loader2 className="animate-spin mx-auto" size={16} />
                  ) : (
                    "Iniciar Sesión"
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Create product form */}
          {showCreateProductForm && (
            <form
              onSubmit={handleCreateProduct}
              className="mt-4 p-5 bg-slate-900/70 border border-blue-500/20 rounded-2xl max-w-md"
            >
              <h3 className="text-sm font-semibold text-blue-300 mb-3">
                Crear nuevo producto
              </h3>
              <div className="space-y-3">
                <select
                  value={productCategoryId}
                  onChange={(e) => setProductCategoryId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:border-blue-500/50 focus:outline-none transition-colors"
                >
                  <option value="1">Computers</option>
                  <option value="2">Fashion</option>
                </select>
                <button
                  type="submit"
                  disabled={actionLoading === "createProduct"}
                  className="w-full py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-300 text-sm font-medium transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  {actionLoading === "createProduct" ? (
                    <Loader2 className="animate-spin mx-auto" size={16} />
                  ) : (
                    "Crear Producto"
                  )}
                </button>
              </div>
            </form>
          )}
        </section>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products list — REST consumption */}
          <section className="lg:col-span-2">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800/50 flex items-center justify-between">
                <h2 className="text-base font-bold flex items-center gap-2">
                  <Package className="text-blue-400" size={18} />
                  Productos
                  <span className="text-xs text-slate-500 font-normal ml-1">
                    (REST: GET /product)
                  </span>
                </h2>
                <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-md">
                  {products.length} total
                </span>
              </div>

              <div className="p-4">
                {loadingProducts ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2
                      className="animate-spin text-slate-500"
                      size={24}
                    />
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <Package
                      className="mx-auto mb-3 text-slate-600"
                      size={36}
                    />
                    <p className="text-sm">No hay productos todavía.</p>
                    <p className="text-xs mt-1 text-slate-600">
                      Crea uno usando el botón de arriba.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-4 bg-slate-800/30 hover:bg-slate-800/60 border border-slate-700/30 rounded-xl transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              product.isActive
                                ? "bg-emerald-500"
                                : "bg-slate-600"
                            }`}
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-slate-200 truncate">
                                {product.title || `Producto #${product.id}`}
                              </span>
                              {product.code && (
                                <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded font-mono">
                                  {product.code}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-0.5">
                              <span className="text-[11px] text-slate-500">
                                ID: {product.id}
                              </span>
                              <span className="text-[11px] text-slate-600">
                                •
                              </span>
                              <span
                                className={`text-[11px] ${
                                  product.isActive
                                    ? "text-emerald-500"
                                    : "text-slate-500"
                                }`}
                              >
                                {product.isActive ? "Activo" : "Inactivo"}
                              </span>
                              {product.categoryId && (
                                <>
                                  <span className="text-[11px] text-slate-600">
                                    •
                                  </span>
                                  <span className="text-[11px] text-slate-500">
                                    Cat: {product.categoryId}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        {authToken && (
                          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            {!product.isActive && (
                              <button
                                onClick={() =>
                                  handleActivateProduct(product.id)
                                }
                                disabled={
                                  actionLoading === `activate-${product.id}`
                                }
                                title="Activar producto"
                                className="p-2 hover:bg-emerald-500/10 rounded-lg text-emerald-500 transition-colors cursor-pointer disabled:opacity-50"
                              >
                                {actionLoading ===
                                `activate-${product.id}` ? (
                                  <Loader2
                                    className="animate-spin"
                                    size={14}
                                  />
                                ) : (
                                  <Power size={14} />
                                )}
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              disabled={
                                actionLoading === `delete-${product.id}`
                              }
                              title="Eliminar producto"
                              className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 transition-colors cursor-pointer disabled:opacity-50"
                            >
                              {actionLoading === `delete-${product.id}` ? (
                                <Loader2
                                  className="animate-spin"
                                  size={14}
                                />
                              ) : (
                                <Trash2 size={14} />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Live Events Stream — SSE consumption */}
          <section className="lg:col-span-1">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800/50 flex items-center justify-between">
                <h2 className="text-base font-bold flex items-center gap-2">
                  <Activity className="text-emerald-400" size={18} />
                  Eventos en Vivo
                </h2>
                <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-md">
                  SSE
                </span>
              </div>

              <div className="p-4 max-h-[600px] overflow-y-auto">
                {events.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <Activity
                      className="mx-auto mb-3 text-slate-600"
                      size={32}
                    />
                    <p className="text-sm">
                      Esperando eventos del servidor...
                    </p>
                    <p className="text-xs mt-1 text-slate-600">
                      Realizá una acción para ver los eventos aquí.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {events.map((ev, i) => (
                      <div
                        key={`${ev.timestamp}-${i}`}
                        className={`p-3.5 rounded-xl border transition-all duration-300 ${getEventColor(
                          ev.type
                        )}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getEventIcon(ev.type)}
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                              {ev.type}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {ev.timestamp}
                          </span>
                        </div>
                        <pre className="text-[11px] bg-black/20 p-2.5 rounded-lg overflow-x-auto text-emerald-400/80 font-mono leading-relaxed">
                          {JSON.stringify(ev.data, null, 2)}
                        </pre>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* System validation footer */}
        <footer className="mt-8 p-5 bg-gradient-to-r from-slate-900/50 to-slate-800/30 border border-slate-800 rounded-2xl">
          <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
            <CheckCircle className="text-emerald-400" size={16} />
            Validación del Sistema E2E
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-400">
            <div className="flex items-start gap-2">
              <CheckCircle
                className="text-emerald-500 shrink-0 mt-0.5"
                size={14}
              />
              <span>
                <strong className="text-slate-300">Consumo REST:</strong> El
                frontend consume <code className="text-blue-400">GET /product</code> y
                muestra datos existentes del backend.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle
                className="text-emerald-500 shrink-0 mt-0.5"
                size={14}
              />
              <span>
                <strong className="text-slate-300">Eventos SSE:</strong> Los
                cambios se reflejan en tiempo real mediante{" "}
                <code className="text-blue-400">EventSource</code> sin recargar
                la página.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle
                className="text-emerald-500 shrink-0 mt-0.5"
                size={14}
              />
              <span>
                <strong className="text-slate-300">E2E desde UI:</strong>{" "}
                Registro, login, creación, activación y eliminación de
                productos directamente desde el dashboard.
              </span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
