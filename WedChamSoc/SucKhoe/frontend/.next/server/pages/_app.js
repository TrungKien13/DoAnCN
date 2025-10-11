/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./lib/auth.tsx":
/*!**********************!*\
  !*** ./lib/auth.tsx ***!
  \**********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   AuthProvider: () => (/* binding */ AuthProvider),\n/* harmony export */   useAuth: () => (/* binding */ useAuth),\n/* harmony export */   useUser: () => (/* binding */ useUser),\n/* harmony export */   withAuth: () => (/* binding */ withAuth)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! js-cookie */ \"js-cookie\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/router */ \"./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! axios */ \"axios\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([js_cookie__WEBPACK_IMPORTED_MODULE_2__, axios__WEBPACK_IMPORTED_MODULE_4__]);\n([js_cookie__WEBPACK_IMPORTED_MODULE_2__, axios__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n/**\r\n * Simple authentication context and hooks\r\n */ \n\n\n\n\nconst AuthContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(undefined);\nconst API_BASE_URL = \"http://localhost:8000/api\" || 0;\nconst AuthProvider = ({ children })=>{\n    const [user, setUser] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);\n    const [token, setToken] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_3__.useRouter)();\n    // Initialize auth state\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        const initAuth = async ()=>{\n            const savedToken = js_cookie__WEBPACK_IMPORTED_MODULE_2__[\"default\"].get(\"auth_token\");\n            if (savedToken) {\n                setToken(savedToken);\n                try {\n                    // Verify token and get user info\n                    const response = await axios__WEBPACK_IMPORTED_MODULE_4__[\"default\"].get(`${API_BASE_URL}/auth/me`, {\n                        headers: {\n                            Authorization: `Bearer ${savedToken}`\n                        }\n                    });\n                    setUser(response.data);\n                } catch (error) {\n                    console.error(\"Token verification failed:\", error);\n                    // Remove invalid token\n                    js_cookie__WEBPACK_IMPORTED_MODULE_2__[\"default\"].remove(\"auth_token\");\n                    setToken(null);\n                }\n            }\n            setIsLoading(false);\n        };\n        initAuth();\n    }, []);\n    const login = async (email, password)=>{\n        try {\n            setIsLoading(true);\n            const response = await axios__WEBPACK_IMPORTED_MODULE_4__[\"default\"].post(`${API_BASE_URL}/auth/login`, {\n                email,\n                password\n            });\n            const { access_token, user: userData } = response.data;\n            // Save token to cookie\n            js_cookie__WEBPACK_IMPORTED_MODULE_2__[\"default\"].set(\"auth_token\", access_token, {\n                expires: 1\n            }); // 1 day\n            setToken(access_token);\n            setUser(userData);\n            // Redirect to dashboard\n            router.push(\"/\");\n        } catch (error) {\n            console.error(\"Login failed:\", error);\n            throw new Error(error.response?.data?.detail || \"Login failed. Please try again.\");\n        } finally{\n            setIsLoading(false);\n        }\n    };\n    const register = async (email, password, full_name, phone)=>{\n        try {\n            setIsLoading(true);\n            const response = await axios__WEBPACK_IMPORTED_MODULE_4__[\"default\"].post(`${API_BASE_URL}/auth/register`, {\n                email,\n                password,\n                full_name,\n                phone\n            });\n            const { access_token, user: userData } = response.data;\n            // Save token to cookie\n            js_cookie__WEBPACK_IMPORTED_MODULE_2__[\"default\"].set(\"auth_token\", access_token, {\n                expires: 1\n            }); // 1 day\n            setToken(access_token);\n            setUser(userData);\n            // Redirect to dashboard\n            router.push(\"/\");\n        } catch (error) {\n            console.error(\"Registration failed:\", error);\n            throw new Error(error.response?.data?.detail || \"Registration failed. Please try again.\");\n        } finally{\n            setIsLoading(false);\n        }\n    };\n    const logout = ()=>{\n        // Remove token from cookie\n        js_cookie__WEBPACK_IMPORTED_MODULE_2__[\"default\"].remove(\"auth_token\");\n        setToken(null);\n        setUser(null);\n        // Redirect to home\n        router.push(\"/\");\n    };\n    const value = {\n        user,\n        isLoading,\n        login,\n        register,\n        logout,\n        token\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(AuthContext.Provider, {\n        value: value,\n        children: children\n    }, void 0, false, {\n        fileName: \"d:\\\\STUDY\\\\DACN\\\\App\\\\DoAnCN\\\\WedChamSoc\\\\SucKhoe\\\\frontend\\\\lib\\\\auth.tsx\",\n        lineNumber: 159,\n        columnNumber: 10\n    }, undefined);\n};\nconst useAuth = ()=>{\n    const context = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(AuthContext);\n    if (context === undefined) {\n        throw new Error(\"useAuth must be used within an AuthProvider\");\n    }\n    return context;\n};\n// HOC for protected pages\nconst withAuth = (Component)=>{\n    return function AuthenticatedComponent(props) {\n        const { user, isLoading } = useAuth();\n        const router = (0,next_router__WEBPACK_IMPORTED_MODULE_3__.useRouter)();\n        (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n            if (!isLoading && !user) {\n                router.push(\"/auth/login\");\n            }\n        }, [\n            user,\n            isLoading,\n            router\n        ]);\n        if (isLoading) {\n            return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"flex items-center justify-center min-h-screen\",\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                    className: \"animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600\"\n                }, void 0, false, {\n                    fileName: \"d:\\\\STUDY\\\\DACN\\\\App\\\\DoAnCN\\\\WedChamSoc\\\\SucKhoe\\\\frontend\\\\lib\\\\auth.tsx\",\n                    lineNumber: 187,\n                    columnNumber: 11\n                }, this)\n            }, void 0, false, {\n                fileName: \"d:\\\\STUDY\\\\DACN\\\\App\\\\DoAnCN\\\\WedChamSoc\\\\SucKhoe\\\\frontend\\\\lib\\\\auth.tsx\",\n                lineNumber: 186,\n                columnNumber: 9\n            }, this);\n        }\n        if (!user) {\n            return null; // Will redirect\n        }\n        return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...props\n        }, void 0, false, {\n            fileName: \"d:\\\\STUDY\\\\DACN\\\\App\\\\DoAnCN\\\\WedChamSoc\\\\SucKhoe\\\\frontend\\\\lib\\\\auth.tsx\",\n            lineNumber: 196,\n            columnNumber: 12\n        }, this);\n    };\n};\n// Hook for checking if user is authenticated\nconst useUser = ()=>{\n    const { user, isLoading } = useAuth();\n    return {\n        user,\n        isLoading,\n        error: null\n    };\n};\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFPO0lBQUs7QUFDeEMsRUFBRSIsInNvdXJjZXMiOlsid2VicGFjazovL2VsZGVybHktaGVhbHRoLWZyb250ZW5kLy4vbGliL2F1dGgudHN4P2Y1NGUiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIFNpbXBsZSBhdXRoZW50aWNhdGlvbiBjb250ZXh0IGFuZCBob29rc1xyXG4gKi9cclxuXHJcbmltcG9ydCBSZWFjdCwge1xyXG4gIGNyZWF0ZUNvbnRleHQsXHJcbiAgdXNlQ29udGV4dCxcclxuICB1c2VTdGF0ZSxcclxuICB1c2VFZmZlY3QsXHJcbiAgUmVhY3ROb2RlLFxyXG59IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgQ29va2llcyBmcm9tIFwianMtY29va2llXCI7XHJcbmltcG9ydCB7IHVzZVJvdXRlciB9IGZyb20gXCJuZXh0L3JvdXRlclwiO1xyXG5pbXBvcnQgYXhpb3MgZnJvbSBcImF4aW9zXCI7XHJcblxyXG5pbnRlcmZhY2UgVXNlciB7XHJcbiAgaWQ6IG51bWJlcjtcclxuICBlbWFpbDogc3RyaW5nO1xyXG4gIGZ1bGxfbmFtZTogc3RyaW5nO1xyXG4gIHBob25lPzogc3RyaW5nO1xyXG4gIGlzX2FjdGl2ZTogYm9vbGVhbjtcclxuICBlbWFpbF92ZXJpZmllZDogYm9vbGVhbjtcclxufVxyXG5cclxuaW50ZXJmYWNlIEF1dGhDb250ZXh0VHlwZSB7XHJcbiAgdXNlcjogVXNlciB8IG51bGw7XHJcbiAgaXNMb2FkaW5nOiBib29sZWFuO1xyXG4gIGxvZ2luOiAoZW1haWw6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZykgPT4gUHJvbWlzZTx2b2lkPjtcclxuICByZWdpc3RlcjogKFxyXG4gICAgZW1haWw6IHN0cmluZyxcclxuICAgIHBhc3N3b3JkOiBzdHJpbmcsXHJcbiAgICBmdWxsX25hbWU6IHN0cmluZyxcclxuICAgIHBob25lPzogc3RyaW5nXHJcbiAgKSA9PiBQcm9taXNlPHZvaWQ+O1xyXG4gIGxvZ291dDogKCkgPT4gdm9pZDtcclxuICB0b2tlbjogc3RyaW5nIHwgbnVsbDtcclxufVxyXG5cclxuY29uc3QgQXV0aENvbnRleHQgPSBjcmVhdGVDb250ZXh0PEF1dGhDb250ZXh0VHlwZSB8IHVuZGVmaW5lZD4odW5kZWZpbmVkKTtcclxuXHJcbmNvbnN0IEFQSV9CQVNFX1VSTCA9XHJcbiAgcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfQVBJX0JBU0VfVVJMIHx8IFwiaHR0cDovL2xvY2FsaG9zdDo4MDAwL2FwaVwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IEF1dGhQcm92aWRlcjogUmVhY3QuRkM8eyBjaGlsZHJlbjogUmVhY3ROb2RlIH0+ID0gKHtcclxuICBjaGlsZHJlbixcclxufSkgPT4ge1xyXG4gIGNvbnN0IFt1c2VyLCBzZXRVc2VyXSA9IHVzZVN0YXRlPFVzZXIgfCBudWxsPihudWxsKTtcclxuICBjb25zdCBbaXNMb2FkaW5nLCBzZXRJc0xvYWRpbmddID0gdXNlU3RhdGUodHJ1ZSk7XHJcbiAgY29uc3QgW3Rva2VuLCBzZXRUb2tlbl0gPSB1c2VTdGF0ZTxzdHJpbmcgfCBudWxsPihudWxsKTtcclxuICBjb25zdCByb3V0ZXIgPSB1c2VSb3V0ZXIoKTtcclxuXHJcbiAgLy8gSW5pdGlhbGl6ZSBhdXRoIHN0YXRlXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGNvbnN0IGluaXRBdXRoID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICBjb25zdCBzYXZlZFRva2VuID0gQ29va2llcy5nZXQoXCJhdXRoX3Rva2VuXCIpO1xyXG4gICAgICBpZiAoc2F2ZWRUb2tlbikge1xyXG4gICAgICAgIHNldFRva2VuKHNhdmVkVG9rZW4pO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAvLyBWZXJpZnkgdG9rZW4gYW5kIGdldCB1c2VyIGluZm9cclxuICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgYXhpb3MuZ2V0KGAke0FQSV9CQVNFX1VSTH0vYXV0aC9tZWAsIHtcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzYXZlZFRva2VufWAsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHNldFVzZXIocmVzcG9uc2UuZGF0YSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJUb2tlbiB2ZXJpZmljYXRpb24gZmFpbGVkOlwiLCBlcnJvcik7XHJcbiAgICAgICAgICAvLyBSZW1vdmUgaW52YWxpZCB0b2tlblxyXG4gICAgICAgICAgQ29va2llcy5yZW1vdmUoXCJhdXRoX3Rva2VuXCIpO1xyXG4gICAgICAgICAgc2V0VG9rZW4obnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHNldElzTG9hZGluZyhmYWxzZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGluaXRBdXRoKCk7XHJcbiAgfSwgW10pO1xyXG5cclxuICBjb25zdCBsb2dpbiA9IGFzeW5jIChlbWFpbDogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICBzZXRJc0xvYWRpbmcodHJ1ZSk7XHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgYXhpb3MucG9zdChgJHtBUElfQkFTRV9VUkx9L2F1dGgvbG9naW5gLCB7XHJcbiAgICAgICAgZW1haWwsXHJcbiAgICAgICAgcGFzc3dvcmQsXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgY29uc3QgeyBhY2Nlc3NfdG9rZW4sIHVzZXI6IHVzZXJEYXRhIH0gPSByZXNwb25zZS5kYXRhO1xyXG5cclxuICAgICAgLy8gU2F2ZSB0b2tlbiB0byBjb29raWVcclxuICAgICAgQ29va2llcy5zZXQoXCJhdXRoX3Rva2VuXCIsIGFjY2Vzc190b2tlbiwgeyBleHBpcmVzOiAxIH0pOyAvLyAxIGRheVxyXG4gICAgICBzZXRUb2tlbihhY2Nlc3NfdG9rZW4pO1xyXG4gICAgICBzZXRVc2VyKHVzZXJEYXRhKTtcclxuXHJcbiAgICAgIC8vIFJlZGlyZWN0IHRvIGRhc2hib2FyZFxyXG4gICAgICByb3V0ZXIucHVzaChcIi9cIik7XHJcbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJMb2dpbiBmYWlsZWQ6XCIsIGVycm9yKTtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgIGVycm9yLnJlc3BvbnNlPy5kYXRhPy5kZXRhaWwgfHwgXCJMb2dpbiBmYWlsZWQuIFBsZWFzZSB0cnkgYWdhaW4uXCJcclxuICAgICAgKTtcclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgIHNldElzTG9hZGluZyhmYWxzZSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgcmVnaXN0ZXIgPSBhc3luYyAoXHJcbiAgICBlbWFpbDogc3RyaW5nLFxyXG4gICAgcGFzc3dvcmQ6IHN0cmluZyxcclxuICAgIGZ1bGxfbmFtZTogc3RyaW5nLFxyXG4gICAgcGhvbmU/OiBzdHJpbmdcclxuICApID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgIHNldElzTG9hZGluZyh0cnVlKTtcclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5wb3N0KGAke0FQSV9CQVNFX1VSTH0vYXV0aC9yZWdpc3RlcmAsIHtcclxuICAgICAgICBlbWFpbCxcclxuICAgICAgICBwYXNzd29yZCxcclxuICAgICAgICBmdWxsX25hbWUsXHJcbiAgICAgICAgcGhvbmUsXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgY29uc3QgeyBhY2Nlc3NfdG9rZW4sIHVzZXI6IHVzZXJEYXRhIH0gPSByZXNwb25zZS5kYXRhO1xyXG5cclxuICAgICAgLy8gU2F2ZSB0b2tlbiB0byBjb29raWVcclxuICAgICAgQ29va2llcy5zZXQoXCJhdXRoX3Rva2VuXCIsIGFjY2Vzc190b2tlbiwgeyBleHBpcmVzOiAxIH0pOyAvLyAxIGRheVxyXG4gICAgICBzZXRUb2tlbihhY2Nlc3NfdG9rZW4pO1xyXG4gICAgICBzZXRVc2VyKHVzZXJEYXRhKTtcclxuXHJcbiAgICAgIC8vIFJlZGlyZWN0IHRvIGRhc2hib2FyZFxyXG4gICAgICByb3V0ZXIucHVzaChcIi9cIik7XHJcbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJSZWdpc3RyYXRpb24gZmFpbGVkOlwiLCBlcnJvcik7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICBlcnJvci5yZXNwb25zZT8uZGF0YT8uZGV0YWlsIHx8IFwiUmVnaXN0cmF0aW9uIGZhaWxlZC4gUGxlYXNlIHRyeSBhZ2Fpbi5cIlxyXG4gICAgICApO1xyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgc2V0SXNMb2FkaW5nKGZhbHNlKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjb25zdCBsb2dvdXQgPSAoKSA9PiB7XHJcbiAgICAvLyBSZW1vdmUgdG9rZW4gZnJvbSBjb29raWVcclxuICAgIENvb2tpZXMucmVtb3ZlKFwiYXV0aF90b2tlblwiKTtcclxuICAgIHNldFRva2VuKG51bGwpO1xyXG4gICAgc2V0VXNlcihudWxsKTtcclxuXHJcbiAgICAvLyBSZWRpcmVjdCB0byBob21lXHJcbiAgICByb3V0ZXIucHVzaChcIi9cIik7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgdmFsdWUgPSB7XHJcbiAgICB1c2VyLFxyXG4gICAgaXNMb2FkaW5nLFxyXG4gICAgbG9naW4sXHJcbiAgICByZWdpc3RlcixcclxuICAgIGxvZ291dCxcclxuICAgIHRva2VuLFxyXG4gIH07XHJcblxyXG4gIHJldHVybiA8QXV0aENvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfT57Y2hpbGRyZW59PC9BdXRoQ29udGV4dC5Qcm92aWRlcj47XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgdXNlQXV0aCA9ICgpID0+IHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChBdXRoQ29udGV4dCk7XHJcbiAgaWYgKGNvbnRleHQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKFwidXNlQXV0aCBtdXN0IGJlIHVzZWQgd2l0aGluIGFuIEF1dGhQcm92aWRlclwiKTtcclxuICB9XHJcbiAgcmV0dXJuIGNvbnRleHQ7XHJcbn07XHJcblxyXG4vLyBIT0MgZm9yIHByb3RlY3RlZCBwYWdlc1xyXG5leHBvcnQgY29uc3Qgd2l0aEF1dGggPSA8UCBleHRlbmRzIG9iamVjdD4oXHJcbiAgQ29tcG9uZW50OiBSZWFjdC5Db21wb25lbnRUeXBlPFA+XHJcbikgPT4ge1xyXG4gIHJldHVybiBmdW5jdGlvbiBBdXRoZW50aWNhdGVkQ29tcG9uZW50KHByb3BzOiBQKSB7XHJcbiAgICBjb25zdCB7IHVzZXIsIGlzTG9hZGluZyB9ID0gdXNlQXV0aCgpO1xyXG4gICAgY29uc3Qgcm91dGVyID0gdXNlUm91dGVyKCk7XHJcblxyXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgICAgaWYgKCFpc0xvYWRpbmcgJiYgIXVzZXIpIHtcclxuICAgICAgICByb3V0ZXIucHVzaChcIi9hdXRoL2xvZ2luXCIpO1xyXG4gICAgICB9XHJcbiAgICB9LCBbdXNlciwgaXNMb2FkaW5nLCByb3V0ZXJdKTtcclxuXHJcbiAgICBpZiAoaXNMb2FkaW5nKSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBtaW4taC1zY3JlZW5cIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYW5pbWF0ZS1zcGluIHJvdW5kZWQtZnVsbCBoLTEyIHctMTIgYm9yZGVyLWItMiBib3JkZXItcHJpbWFyeS02MDBcIj48L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXVzZXIpIHtcclxuICAgICAgcmV0dXJuIG51bGw7IC8vIFdpbGwgcmVkaXJlY3RcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gPENvbXBvbmVudCB7Li4ucHJvcHN9IC8+O1xyXG4gIH07XHJcbn07XHJcblxyXG4vLyBIb29rIGZvciBjaGVja2luZyBpZiB1c2VyIGlzIGF1dGhlbnRpY2F0ZWRcclxuZXhwb3J0IGNvbnN0IHVzZVVzZXIgPSAoKSA9PiB7XHJcbiAgY29uc3QgeyB1c2VyLCBpc0xvYWRpbmcgfSA9IHVzZUF1dGgoKTtcclxuICByZXR1cm4geyB1c2VyLCBpc0xvYWRpbmcsIGVycm9yOiBudWxsIH07XHJcbn07XHJcbiJdLCJuYW1lcyI6WyJSZWFjdCIsImNyZWF0ZUNvbnRleHQiLCJ1c2VDb250ZXh0IiwidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJDb29raWVzIiwidXNlUm91dGVyIiwiYXhpb3MiLCJBdXRoQ29udGV4dCIsInVuZGVmaW5lZCIsIkFQSV9CQVNFX1VSTCIsInByb2Nlc3MiLCJlbnYiLCJORVhUX1BVQkxJQ19BUElfQkFTRV9VUkwiLCJBdXRoUHJvdmlkZXIiLCJjaGlsZHJlbiIsInVzZXIiLCJzZXRVc2VyIiwiaXNMb2FkaW5nIiwic2V0SXNMb2FkaW5nIiwidG9rZW4iLCJzZXRUb2tlbiIsInJvdXRlciIsImluaXRBdXRoIiwic2F2ZWRUb2tlbiIsImdldCIsInJlc3BvbnNlIiwiaGVhZGVycyIsIkF1dGhvcml6YXRpb24iLCJkYXRhIiwiZXJyb3IiLCJjb25zb2xlIiwicmVtb3ZlIiwibG9naW4iLCJlbWFpbCIsInBhc3N3b3JkIiwicG9zdCIsImFjY2Vzc190b2tlbiIsInVzZXJEYXRhIiwic2V0IiwiZXhwaXJlcyIsInB1c2giLCJFcnJvciIsImRldGFpbCIsInJlZ2lzdGVyIiwiZnVsbF9uYW1lIiwicGhvbmUiLCJsb2dvdXQiLCJ2YWx1ZSIsIlByb3ZpZGVyIiwidXNlQXV0aCIsImNvbnRleHQiLCJ3aXRoQXV0aCIsIkNvbXBvbmVudCIsIkF1dGhlbnRpY2F0ZWRDb21wb25lbnQiLCJwcm9wcyIsImRpdiIsImNsYXNzTmFtZSIsInVzZVVzZXIiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./lib/auth.tsx\n");

/***/ }),

/***/ "./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/auth */ \"./lib/auth.tsx\");\n/* harmony import */ var react_query__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-query */ \"react-query\");\n/* harmony import */ var react_query__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_query__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var react_query_devtools__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-query/devtools */ \"react-query/devtools\");\n/* harmony import */ var react_query_devtools__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_query_devtools__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_5__);\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_lib_auth__WEBPACK_IMPORTED_MODULE_1__]);\n_lib_auth__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n/**\r\n * Next.js App component for Elderly Health Support System\r\n */ \n\n\n\n\n\n// Create a client\nconst createQueryClient = ()=>new react_query__WEBPACK_IMPORTED_MODULE_2__.QueryClient({\n        defaultOptions: {\n            queries: {\n                retry: 1,\n                refetchOnWindowFocus: false,\n                staleTime: 5 * 60 * 1000,\n                cacheTime: 10 * 60 * 1000\n            },\n            mutations: {\n                retry: 1\n            }\n        }\n    });\nfunction App({ Component, pageProps }) {\n    const [queryClient] = (0,react__WEBPACK_IMPORTED_MODULE_4__.useState)(()=>createQueryClient());\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_lib_auth__WEBPACK_IMPORTED_MODULE_1__.AuthProvider, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_query__WEBPACK_IMPORTED_MODULE_2__.QueryClientProvider, {\n            client: queryClient,\n            children: [\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                    ...pageProps\n                }, void 0, false, {\n                    fileName: \"d:\\\\STUDY\\\\DACN\\\\App\\\\DoAnCN\\\\WedChamSoc\\\\SucKhoe\\\\frontend\\\\pages\\\\_app.tsx\",\n                    lineNumber: 34,\n                    columnNumber: 9\n                }, this),\n                 true && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_query_devtools__WEBPACK_IMPORTED_MODULE_3__.ReactQueryDevtools, {\n                    initialIsOpen: false\n                }, void 0, false, {\n                    fileName: \"d:\\\\STUDY\\\\DACN\\\\App\\\\DoAnCN\\\\WedChamSoc\\\\SucKhoe\\\\frontend\\\\pages\\\\_app.tsx\",\n                    lineNumber: 36,\n                    columnNumber: 11\n                }, this)\n            ]\n        }, void 0, true, {\n            fileName: \"d:\\\\STUDY\\\\DACN\\\\App\\\\DoAnCN\\\\WedChamSoc\\\\SucKhoe\\\\frontend\\\\pages\\\\_app.tsx\",\n            lineNumber: 33,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"d:\\\\STUDY\\\\DACN\\\\App\\\\DoAnCN\\\\WedChamSoc\\\\SucKhoe\\\\frontend\\\\pages\\\\_app.tsx\",\n        lineNumber: 32,\n        columnNumber: 5\n    }, this);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Q0FFQztBQUd5QztBQUNxQjtBQUNMO0FBQ3pCO0FBQ0g7QUFFOUIsa0JBQWtCO0FBQ2xCLE1BQU1LLG9CQUFvQixJQUN4QixJQUFJSixvREFBV0EsQ0FBQztRQUNkSyxnQkFBZ0I7WUFDZEMsU0FBUztnQkFDUEMsT0FBTztnQkFDUEMsc0JBQXNCO2dCQUN0QkMsV0FBVyxJQUFJLEtBQUs7Z0JBQ3BCQyxXQUFXLEtBQUssS0FBSztZQUN2QjtZQUNBQyxXQUFXO2dCQUNUSixPQUFPO1lBQ1Q7UUFDRjtJQUNGO0FBRWEsU0FBU0ssSUFBSSxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBWTtJQUM1RCxNQUFNLENBQUNDLFlBQVksR0FBR1osK0NBQVFBLENBQUMsSUFBTUM7SUFFckMscUJBQ0UsOERBQUNMLG1EQUFZQTtrQkFDWCw0RUFBQ0UsNERBQW1CQTtZQUFDZSxRQUFRRDs7OEJBQzNCLDhEQUFDRjtvQkFBVyxHQUFHQyxTQUFTOzs7Ozs7Z0JBakNoQyxLQWtDK0Msa0JBQ3JDLDhEQUFDWixvRUFBa0JBO29CQUFDZSxlQUFlOzs7Ozs7Ozs7Ozs7Ozs7OztBQUs3QyIsInNvdXJjZXMiOlsid2VicGFjazovL2VsZGVybHktaGVhbHRoLWZyb250ZW5kLy4vcGFnZXMvX2FwcC50c3g/MmZiZSJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogTmV4dC5qcyBBcHAgY29tcG9uZW50IGZvciBFbGRlcmx5IEhlYWx0aCBTdXBwb3J0IFN5c3RlbVxyXG4gKi9cclxuXHJcbmltcG9ydCB0eXBlIHsgQXBwUHJvcHMgfSBmcm9tIFwibmV4dC9hcHBcIjtcclxuaW1wb3J0IHsgQXV0aFByb3ZpZGVyIH0gZnJvbSBcIkAvbGliL2F1dGhcIjtcclxuaW1wb3J0IHsgUXVlcnlDbGllbnQsIFF1ZXJ5Q2xpZW50UHJvdmlkZXIgfSBmcm9tIFwicmVhY3QtcXVlcnlcIjtcclxuaW1wb3J0IHsgUmVhY3RRdWVyeURldnRvb2xzIH0gZnJvbSBcInJlYWN0LXF1ZXJ5L2RldnRvb2xzXCI7XHJcbmltcG9ydCB7IHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCBcIkAvc3R5bGVzL2dsb2JhbHMuY3NzXCI7XHJcblxyXG4vLyBDcmVhdGUgYSBjbGllbnRcclxuY29uc3QgY3JlYXRlUXVlcnlDbGllbnQgPSAoKSA9PlxyXG4gIG5ldyBRdWVyeUNsaWVudCh7XHJcbiAgICBkZWZhdWx0T3B0aW9uczoge1xyXG4gICAgICBxdWVyaWVzOiB7XHJcbiAgICAgICAgcmV0cnk6IDEsXHJcbiAgICAgICAgcmVmZXRjaE9uV2luZG93Rm9jdXM6IGZhbHNlLFxyXG4gICAgICAgIHN0YWxlVGltZTogNSAqIDYwICogMTAwMCwgLy8gNSBtaW51dGVzXHJcbiAgICAgICAgY2FjaGVUaW1lOiAxMCAqIDYwICogMTAwMCwgLy8gMTAgbWludXRlc1xyXG4gICAgICB9LFxyXG4gICAgICBtdXRhdGlvbnM6IHtcclxuICAgICAgICByZXRyeTogMSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9OiBBcHBQcm9wcykge1xyXG4gIGNvbnN0IFtxdWVyeUNsaWVudF0gPSB1c2VTdGF0ZSgoKSA9PiBjcmVhdGVRdWVyeUNsaWVudCgpKTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxBdXRoUHJvdmlkZXI+XHJcbiAgICAgIDxRdWVyeUNsaWVudFByb3ZpZGVyIGNsaWVudD17cXVlcnlDbGllbnR9PlxyXG4gICAgICAgIDxDb21wb25lbnQgey4uLnBhZ2VQcm9wc30gLz5cclxuICAgICAgICB7cHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwiZGV2ZWxvcG1lbnRcIiAmJiAoXHJcbiAgICAgICAgICA8UmVhY3RRdWVyeURldnRvb2xzIGluaXRpYWxJc09wZW49e2ZhbHNlfSAvPlxyXG4gICAgICAgICl9XHJcbiAgICAgIDwvUXVlcnlDbGllbnRQcm92aWRlcj5cclxuICAgIDwvQXV0aFByb3ZpZGVyPlxyXG4gICk7XHJcbn1cclxuIl0sIm5hbWVzIjpbIkF1dGhQcm92aWRlciIsIlF1ZXJ5Q2xpZW50IiwiUXVlcnlDbGllbnRQcm92aWRlciIsIlJlYWN0UXVlcnlEZXZ0b29scyIsInVzZVN0YXRlIiwiY3JlYXRlUXVlcnlDbGllbnQiLCJkZWZhdWx0T3B0aW9ucyIsInF1ZXJpZXMiLCJyZXRyeSIsInJlZmV0Y2hPbldpbmRvd0ZvY3VzIiwic3RhbGVUaW1lIiwiY2FjaGVUaW1lIiwibXV0YXRpb25zIiwiQXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIiwicXVlcnlDbGllbnQiLCJjbGllbnQiLCJpbml0aWFsSXNPcGVuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-dom");

/***/ }),

/***/ "react-query":
/*!******************************!*\
  !*** external "react-query" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-query");

/***/ }),

/***/ "react-query/devtools":
/*!***************************************!*\
  !*** external "react-query/devtools" ***!
  \***************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-query/devtools");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = import("axios");;

/***/ }),

/***/ "js-cookie":
/*!****************************!*\
  !*** external "js-cookie" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = import("js-cookie");;

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("./pages/_app.tsx")));
module.exports = __webpack_exports__;

})();