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
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   AuthProvider: () => (/* binding */ AuthProvider),\n/* harmony export */   useAuth: () => (/* binding */ useAuth),\n/* harmony export */   useUser: () => (/* binding */ useUser),\n/* harmony export */   withAuth: () => (/* binding */ withAuth)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! js-cookie */ \"js-cookie\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/router */ \"./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! axios */ \"axios\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([js_cookie__WEBPACK_IMPORTED_MODULE_2__, axios__WEBPACK_IMPORTED_MODULE_4__]);\n([js_cookie__WEBPACK_IMPORTED_MODULE_2__, axios__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n/**\n * Simple authentication context and hooks\n */ \n\n\n\n\nconst AuthContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(undefined);\nconst API_BASE_URL = \"http://localhost:8001/api\" || 0;\nconst AuthProvider = ({ children })=>{\n    const [user, setUser] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);\n    const [token, setToken] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_3__.useRouter)();\n    // Initialize auth state\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        const initAuth = async ()=>{\n            const savedToken = js_cookie__WEBPACK_IMPORTED_MODULE_2__[\"default\"].get(\"auth_token\");\n            if (savedToken) {\n                setToken(savedToken);\n                try {\n                    // Verify token and get user info\n                    const response = await axios__WEBPACK_IMPORTED_MODULE_4__[\"default\"].get(`${API_BASE_URL}/auth/me`, {\n                        headers: {\n                            Authorization: `Bearer ${savedToken}`\n                        }\n                    });\n                    setUser(response.data);\n                } catch (error) {\n                    console.error(\"Token verification failed:\", error);\n                    // Remove invalid token\n                    js_cookie__WEBPACK_IMPORTED_MODULE_2__[\"default\"].remove(\"auth_token\");\n                    setToken(null);\n                }\n            }\n            setIsLoading(false);\n        };\n        initAuth();\n    }, []);\n    const login = async (email, password)=>{\n        try {\n            setIsLoading(true);\n            const response = await axios__WEBPACK_IMPORTED_MODULE_4__[\"default\"].post(`${API_BASE_URL}/auth/login`, {\n                email,\n                password\n            });\n            const { access_token, user: userData } = response.data;\n            // Save token to cookie\n            js_cookie__WEBPACK_IMPORTED_MODULE_2__[\"default\"].set(\"auth_token\", access_token, {\n                expires: 1\n            }); // 1 day\n            setToken(access_token);\n            setUser(userData);\n            // Redirect to dashboard\n            router.push(\"/\");\n        } catch (error) {\n            console.error(\"Login failed:\", error);\n            throw new Error(error.response?.data?.detail || \"Login failed. Please try again.\");\n        } finally{\n            setIsLoading(false);\n        }\n    };\n    const register = async (email, password, full_name, phone)=>{\n        try {\n            setIsLoading(true);\n            const response = await axios__WEBPACK_IMPORTED_MODULE_4__[\"default\"].post(`${API_BASE_URL}/auth/register`, {\n                email,\n                password,\n                full_name,\n                phone\n            });\n            const { access_token, user: userData } = response.data;\n            // Save token to cookie\n            js_cookie__WEBPACK_IMPORTED_MODULE_2__[\"default\"].set(\"auth_token\", access_token, {\n                expires: 1\n            }); // 1 day\n            setToken(access_token);\n            setUser(userData);\n            // Redirect to dashboard\n            router.push(\"/\");\n        } catch (error) {\n            console.error(\"Registration failed:\", error);\n            throw new Error(error.response?.data?.detail || \"Registration failed. Please try again.\");\n        } finally{\n            setIsLoading(false);\n        }\n    };\n    const logout = ()=>{\n        // Remove token from cookie\n        js_cookie__WEBPACK_IMPORTED_MODULE_2__[\"default\"].remove(\"auth_token\");\n        setToken(null);\n        setUser(null);\n        // Redirect to home\n        router.push(\"/\");\n    };\n    const value = {\n        user,\n        isLoading,\n        login,\n        register,\n        logout,\n        token\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(AuthContext.Provider, {\n        value: value,\n        children: children\n    }, void 0, false, {\n        fileName: \"D:\\\\WedChamSoc\\\\SucKhoe\\\\frontend\\\\lib\\\\auth.tsx\",\n        lineNumber: 159,\n        columnNumber: 10\n    }, undefined);\n};\nconst useAuth = ()=>{\n    const context = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(AuthContext);\n    if (context === undefined) {\n        throw new Error(\"useAuth must be used within an AuthProvider\");\n    }\n    return context;\n};\n// HOC for protected pages\nconst withAuth = (Component)=>{\n    return function AuthenticatedComponent(props) {\n        const { user, isLoading } = useAuth();\n        const router = (0,next_router__WEBPACK_IMPORTED_MODULE_3__.useRouter)();\n        (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n            if (!isLoading && !user) {\n                router.push(\"/auth/login\");\n            }\n        }, [\n            user,\n            isLoading,\n            router\n        ]);\n        if (isLoading) {\n            return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"flex items-center justify-center min-h-screen\",\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                    className: \"animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600\"\n                }, void 0, false, {\n                    fileName: \"D:\\\\WedChamSoc\\\\SucKhoe\\\\frontend\\\\lib\\\\auth.tsx\",\n                    lineNumber: 187,\n                    columnNumber: 11\n                }, this)\n            }, void 0, false, {\n                fileName: \"D:\\\\WedChamSoc\\\\SucKhoe\\\\frontend\\\\lib\\\\auth.tsx\",\n                lineNumber: 186,\n                columnNumber: 9\n            }, this);\n        }\n        if (!user) {\n            return null; // Will redirect\n        }\n        return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...props\n        }, void 0, false, {\n            fileName: \"D:\\\\WedChamSoc\\\\SucKhoe\\\\frontend\\\\lib\\\\auth.tsx\",\n            lineNumber: 196,\n            columnNumber: 12\n        }, this);\n    };\n};\n// Hook for checking if user is authenticated\nconst useUser = ()=>{\n    const { user, isLoading } = useAuth();\n    return {\n        user,\n        isLoading,\n        error: null\n    };\n};\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFPO0lBQUs7QUFDeEMsRUFBRSIsInNvdXJjZXMiOlsid2VicGFjazovL2VsZGVybHktaGVhbHRoLWZyb250ZW5kLy4vbGliL2F1dGgudHN4P2Y1NGUiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTaW1wbGUgYXV0aGVudGljYXRpb24gY29udGV4dCBhbmQgaG9va3NcbiAqL1xuXG5pbXBvcnQgUmVhY3QsIHtcbiAgY3JlYXRlQ29udGV4dCxcbiAgdXNlQ29udGV4dCxcbiAgdXNlU3RhdGUsXG4gIHVzZUVmZmVjdCxcbiAgUmVhY3ROb2RlLFxufSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBDb29raWVzIGZyb20gXCJqcy1jb29raWVcIjtcbmltcG9ydCB7IHVzZVJvdXRlciB9IGZyb20gXCJuZXh0L3JvdXRlclwiO1xuaW1wb3J0IGF4aW9zIGZyb20gXCJheGlvc1wiO1xuXG5pbnRlcmZhY2UgVXNlciB7XG4gIGlkOiBudW1iZXI7XG4gIGVtYWlsOiBzdHJpbmc7XG4gIGZ1bGxfbmFtZTogc3RyaW5nO1xuICBwaG9uZT86IHN0cmluZztcbiAgaXNfYWN0aXZlOiBib29sZWFuO1xuICBlbWFpbF92ZXJpZmllZDogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIEF1dGhDb250ZXh0VHlwZSB7XG4gIHVzZXI6IFVzZXIgfCBudWxsO1xuICBpc0xvYWRpbmc6IGJvb2xlYW47XG4gIGxvZ2luOiAoZW1haWw6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZykgPT4gUHJvbWlzZTx2b2lkPjtcbiAgcmVnaXN0ZXI6IChcbiAgICBlbWFpbDogc3RyaW5nLFxuICAgIHBhc3N3b3JkOiBzdHJpbmcsXG4gICAgZnVsbF9uYW1lOiBzdHJpbmcsXG4gICAgcGhvbmU/OiBzdHJpbmdcbiAgKSA9PiBQcm9taXNlPHZvaWQ+O1xuICBsb2dvdXQ6ICgpID0+IHZvaWQ7XG4gIHRva2VuOiBzdHJpbmcgfCBudWxsO1xufVxuXG5jb25zdCBBdXRoQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQ8QXV0aENvbnRleHRUeXBlIHwgdW5kZWZpbmVkPih1bmRlZmluZWQpO1xuXG5jb25zdCBBUElfQkFTRV9VUkwgPVxuICBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19BUElfQkFTRV9VUkwgfHwgXCJodHRwOi8vbG9jYWxob3N0OjgwMDEvYXBpXCI7XG5cbmV4cG9ydCBjb25zdCBBdXRoUHJvdmlkZXI6IFJlYWN0LkZDPHsgY2hpbGRyZW46IFJlYWN0Tm9kZSB9PiA9ICh7XG4gIGNoaWxkcmVuLFxufSkgPT4ge1xuICBjb25zdCBbdXNlciwgc2V0VXNlcl0gPSB1c2VTdGF0ZTxVc2VyIHwgbnVsbD4obnVsbCk7XG4gIGNvbnN0IFtpc0xvYWRpbmcsIHNldElzTG9hZGluZ10gPSB1c2VTdGF0ZSh0cnVlKTtcbiAgY29uc3QgW3Rva2VuLCBzZXRUb2tlbl0gPSB1c2VTdGF0ZTxzdHJpbmcgfCBudWxsPihudWxsKTtcbiAgY29uc3Qgcm91dGVyID0gdXNlUm91dGVyKCk7XG5cbiAgLy8gSW5pdGlhbGl6ZSBhdXRoIHN0YXRlXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgaW5pdEF1dGggPSBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBzYXZlZFRva2VuID0gQ29va2llcy5nZXQoXCJhdXRoX3Rva2VuXCIpO1xuICAgICAgaWYgKHNhdmVkVG9rZW4pIHtcbiAgICAgICAgc2V0VG9rZW4oc2F2ZWRUb2tlbik7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gVmVyaWZ5IHRva2VuIGFuZCBnZXQgdXNlciBpbmZvXG4gICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5nZXQoYCR7QVBJX0JBU0VfVVJMfS9hdXRoL21lYCwge1xuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7c2F2ZWRUb2tlbn1gLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBzZXRVc2VyKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJUb2tlbiB2ZXJpZmljYXRpb24gZmFpbGVkOlwiLCBlcnJvcik7XG4gICAgICAgICAgLy8gUmVtb3ZlIGludmFsaWQgdG9rZW5cbiAgICAgICAgICBDb29raWVzLnJlbW92ZShcImF1dGhfdG9rZW5cIik7XG4gICAgICAgICAgc2V0VG9rZW4obnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHNldElzTG9hZGluZyhmYWxzZSk7XG4gICAgfTtcblxuICAgIGluaXRBdXRoKCk7XG4gIH0sIFtdKTtcblxuICBjb25zdCBsb2dpbiA9IGFzeW5jIChlbWFpbDogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIHNldElzTG9hZGluZyh0cnVlKTtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgYXhpb3MucG9zdChgJHtBUElfQkFTRV9VUkx9L2F1dGgvbG9naW5gLCB7XG4gICAgICAgIGVtYWlsLFxuICAgICAgICBwYXNzd29yZCxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCB7IGFjY2Vzc190b2tlbiwgdXNlcjogdXNlckRhdGEgfSA9IHJlc3BvbnNlLmRhdGE7XG5cbiAgICAgIC8vIFNhdmUgdG9rZW4gdG8gY29va2llXG4gICAgICBDb29raWVzLnNldChcImF1dGhfdG9rZW5cIiwgYWNjZXNzX3Rva2VuLCB7IGV4cGlyZXM6IDEgfSk7IC8vIDEgZGF5XG4gICAgICBzZXRUb2tlbihhY2Nlc3NfdG9rZW4pO1xuICAgICAgc2V0VXNlcih1c2VyRGF0YSk7XG5cbiAgICAgIC8vIFJlZGlyZWN0IHRvIGRhc2hib2FyZFxuICAgICAgcm91dGVyLnB1c2goXCIvXCIpO1xuICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJMb2dpbiBmYWlsZWQ6XCIsIGVycm9yKTtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgZXJyb3IucmVzcG9uc2U/LmRhdGE/LmRldGFpbCB8fCBcIkxvZ2luIGZhaWxlZC4gUGxlYXNlIHRyeSBhZ2Fpbi5cIlxuICAgICAgKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0SXNMb2FkaW5nKGZhbHNlKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgcmVnaXN0ZXIgPSBhc3luYyAoXG4gICAgZW1haWw6IHN0cmluZyxcbiAgICBwYXNzd29yZDogc3RyaW5nLFxuICAgIGZ1bGxfbmFtZTogc3RyaW5nLFxuICAgIHBob25lPzogc3RyaW5nXG4gICkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBzZXRJc0xvYWRpbmcodHJ1ZSk7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGF4aW9zLnBvc3QoYCR7QVBJX0JBU0VfVVJMfS9hdXRoL3JlZ2lzdGVyYCwge1xuICAgICAgICBlbWFpbCxcbiAgICAgICAgcGFzc3dvcmQsXG4gICAgICAgIGZ1bGxfbmFtZSxcbiAgICAgICAgcGhvbmUsXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgeyBhY2Nlc3NfdG9rZW4sIHVzZXI6IHVzZXJEYXRhIH0gPSByZXNwb25zZS5kYXRhO1xuXG4gICAgICAvLyBTYXZlIHRva2VuIHRvIGNvb2tpZVxuICAgICAgQ29va2llcy5zZXQoXCJhdXRoX3Rva2VuXCIsIGFjY2Vzc190b2tlbiwgeyBleHBpcmVzOiAxIH0pOyAvLyAxIGRheVxuICAgICAgc2V0VG9rZW4oYWNjZXNzX3Rva2VuKTtcbiAgICAgIHNldFVzZXIodXNlckRhdGEpO1xuXG4gICAgICAvLyBSZWRpcmVjdCB0byBkYXNoYm9hcmRcbiAgICAgIHJvdXRlci5wdXNoKFwiL1wiKTtcbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiUmVnaXN0cmF0aW9uIGZhaWxlZDpcIiwgZXJyb3IpO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBlcnJvci5yZXNwb25zZT8uZGF0YT8uZGV0YWlsIHx8IFwiUmVnaXN0cmF0aW9uIGZhaWxlZC4gUGxlYXNlIHRyeSBhZ2Fpbi5cIlxuICAgICAgKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0SXNMb2FkaW5nKGZhbHNlKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgbG9nb3V0ID0gKCkgPT4ge1xuICAgIC8vIFJlbW92ZSB0b2tlbiBmcm9tIGNvb2tpZVxuICAgIENvb2tpZXMucmVtb3ZlKFwiYXV0aF90b2tlblwiKTtcbiAgICBzZXRUb2tlbihudWxsKTtcbiAgICBzZXRVc2VyKG51bGwpO1xuXG4gICAgLy8gUmVkaXJlY3QgdG8gaG9tZVxuICAgIHJvdXRlci5wdXNoKFwiL1wiKTtcbiAgfTtcblxuICBjb25zdCB2YWx1ZSA9IHtcbiAgICB1c2VyLFxuICAgIGlzTG9hZGluZyxcbiAgICBsb2dpbixcbiAgICByZWdpc3RlcixcbiAgICBsb2dvdXQsXG4gICAgdG9rZW4sXG4gIH07XG5cbiAgcmV0dXJuIDxBdXRoQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9PntjaGlsZHJlbn08L0F1dGhDb250ZXh0LlByb3ZpZGVyPjtcbn07XG5cbmV4cG9ydCBjb25zdCB1c2VBdXRoID0gKCkgPT4ge1xuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChBdXRoQ29udGV4dCk7XG4gIGlmIChjb250ZXh0ID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1c2VBdXRoIG11c3QgYmUgdXNlZCB3aXRoaW4gYW4gQXV0aFByb3ZpZGVyXCIpO1xuICB9XG4gIHJldHVybiBjb250ZXh0O1xufTtcblxuLy8gSE9DIGZvciBwcm90ZWN0ZWQgcGFnZXNcbmV4cG9ydCBjb25zdCB3aXRoQXV0aCA9IDxQIGV4dGVuZHMgb2JqZWN0PihcbiAgQ29tcG9uZW50OiBSZWFjdC5Db21wb25lbnRUeXBlPFA+XG4pID0+IHtcbiAgcmV0dXJuIGZ1bmN0aW9uIEF1dGhlbnRpY2F0ZWRDb21wb25lbnQocHJvcHM6IFApIHtcbiAgICBjb25zdCB7IHVzZXIsIGlzTG9hZGluZyB9ID0gdXNlQXV0aCgpO1xuICAgIGNvbnN0IHJvdXRlciA9IHVzZVJvdXRlcigpO1xuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgIGlmICghaXNMb2FkaW5nICYmICF1c2VyKSB7XG4gICAgICAgIHJvdXRlci5wdXNoKFwiL2F1dGgvbG9naW5cIik7XG4gICAgICB9XG4gICAgfSwgW3VzZXIsIGlzTG9hZGluZywgcm91dGVyXSk7XG5cbiAgICBpZiAoaXNMb2FkaW5nKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIG1pbi1oLXNjcmVlblwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYW5pbWF0ZS1zcGluIHJvdW5kZWQtZnVsbCBoLTEyIHctMTIgYm9yZGVyLWItMiBib3JkZXItcHJpbWFyeS02MDBcIj48L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICghdXNlcikge1xuICAgICAgcmV0dXJuIG51bGw7IC8vIFdpbGwgcmVkaXJlY3RcbiAgICB9XG5cbiAgICByZXR1cm4gPENvbXBvbmVudCB7Li4ucHJvcHN9IC8+O1xuICB9O1xufTtcblxuLy8gSG9vayBmb3IgY2hlY2tpbmcgaWYgdXNlciBpcyBhdXRoZW50aWNhdGVkXG5leHBvcnQgY29uc3QgdXNlVXNlciA9ICgpID0+IHtcbiAgY29uc3QgeyB1c2VyLCBpc0xvYWRpbmcgfSA9IHVzZUF1dGgoKTtcbiAgcmV0dXJuIHsgdXNlciwgaXNMb2FkaW5nLCBlcnJvcjogbnVsbCB9O1xufTtcbiJdLCJuYW1lcyI6WyJSZWFjdCIsImNyZWF0ZUNvbnRleHQiLCJ1c2VDb250ZXh0IiwidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJDb29raWVzIiwidXNlUm91dGVyIiwiYXhpb3MiLCJBdXRoQ29udGV4dCIsInVuZGVmaW5lZCIsIkFQSV9CQVNFX1VSTCIsInByb2Nlc3MiLCJlbnYiLCJORVhUX1BVQkxJQ19BUElfQkFTRV9VUkwiLCJBdXRoUHJvdmlkZXIiLCJjaGlsZHJlbiIsInVzZXIiLCJzZXRVc2VyIiwiaXNMb2FkaW5nIiwic2V0SXNMb2FkaW5nIiwidG9rZW4iLCJzZXRUb2tlbiIsInJvdXRlciIsImluaXRBdXRoIiwic2F2ZWRUb2tlbiIsImdldCIsInJlc3BvbnNlIiwiaGVhZGVycyIsIkF1dGhvcml6YXRpb24iLCJkYXRhIiwiZXJyb3IiLCJjb25zb2xlIiwicmVtb3ZlIiwibG9naW4iLCJlbWFpbCIsInBhc3N3b3JkIiwicG9zdCIsImFjY2Vzc190b2tlbiIsInVzZXJEYXRhIiwic2V0IiwiZXhwaXJlcyIsInB1c2giLCJFcnJvciIsImRldGFpbCIsInJlZ2lzdGVyIiwiZnVsbF9uYW1lIiwicGhvbmUiLCJsb2dvdXQiLCJ2YWx1ZSIsIlByb3ZpZGVyIiwidXNlQXV0aCIsImNvbnRleHQiLCJ3aXRoQXV0aCIsIkNvbXBvbmVudCIsIkF1dGhlbnRpY2F0ZWRDb21wb25lbnQiLCJwcm9wcyIsImRpdiIsImNsYXNzTmFtZSIsInVzZVVzZXIiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./lib/auth.tsx\n");

/***/ }),

/***/ "./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/auth */ \"./lib/auth.tsx\");\n/* harmony import */ var react_query__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-query */ \"react-query\");\n/* harmony import */ var react_query__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_query__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var react_query_devtools__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-query/devtools */ \"react-query/devtools\");\n/* harmony import */ var react_query_devtools__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_query_devtools__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_5__);\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_lib_auth__WEBPACK_IMPORTED_MODULE_1__]);\n_lib_auth__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n/**\n * Next.js App component for Elderly Health Support System\n */ \n\n\n\n\n\n// Create a client\nconst createQueryClient = ()=>new react_query__WEBPACK_IMPORTED_MODULE_2__.QueryClient({\n        defaultOptions: {\n            queries: {\n                retry: 1,\n                refetchOnWindowFocus: false,\n                staleTime: 5 * 60 * 1000,\n                cacheTime: 10 * 60 * 1000\n            },\n            mutations: {\n                retry: 1\n            }\n        }\n    });\nfunction App({ Component, pageProps }) {\n    const [queryClient] = (0,react__WEBPACK_IMPORTED_MODULE_4__.useState)(()=>createQueryClient());\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_lib_auth__WEBPACK_IMPORTED_MODULE_1__.AuthProvider, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_query__WEBPACK_IMPORTED_MODULE_2__.QueryClientProvider, {\n            client: queryClient,\n            children: [\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                    ...pageProps\n                }, void 0, false, {\n                    fileName: \"D:\\\\WedChamSoc\\\\SucKhoe\\\\frontend\\\\pages\\\\_app.tsx\",\n                    lineNumber: 34,\n                    columnNumber: 9\n                }, this),\n                 true && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_query_devtools__WEBPACK_IMPORTED_MODULE_3__.ReactQueryDevtools, {\n                    initialIsOpen: false\n                }, void 0, false, {\n                    fileName: \"D:\\\\WedChamSoc\\\\SucKhoe\\\\frontend\\\\pages\\\\_app.tsx\",\n                    lineNumber: 36,\n                    columnNumber: 11\n                }, this)\n            ]\n        }, void 0, true, {\n            fileName: \"D:\\\\WedChamSoc\\\\SucKhoe\\\\frontend\\\\pages\\\\_app.tsx\",\n            lineNumber: 33,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"D:\\\\WedChamSoc\\\\SucKhoe\\\\frontend\\\\pages\\\\_app.tsx\",\n        lineNumber: 32,\n        columnNumber: 5\n    }, this);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Q0FFQztBQUd5QztBQUNxQjtBQUNMO0FBQ3pCO0FBQ0g7QUFFOUIsa0JBQWtCO0FBQ2xCLE1BQU1LLG9CQUFvQixJQUN4QixJQUFJSixvREFBV0EsQ0FBQztRQUNkSyxnQkFBZ0I7WUFDZEMsU0FBUztnQkFDUEMsT0FBTztnQkFDUEMsc0JBQXNCO2dCQUN0QkMsV0FBVyxJQUFJLEtBQUs7Z0JBQ3BCQyxXQUFXLEtBQUssS0FBSztZQUN2QjtZQUNBQyxXQUFXO2dCQUNUSixPQUFPO1lBQ1Q7UUFDRjtJQUNGO0FBRWEsU0FBU0ssSUFBSSxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBWTtJQUM1RCxNQUFNLENBQUNDLFlBQVksR0FBR1osK0NBQVFBLENBQUMsSUFBTUM7SUFFckMscUJBQ0UsOERBQUNMLG1EQUFZQTtrQkFDWCw0RUFBQ0UsNERBQW1CQTtZQUFDZSxRQUFRRDs7OEJBQzNCLDhEQUFDRjtvQkFBVyxHQUFHQyxTQUFTOzs7Ozs7Z0JBakNoQyxLQWtDK0Msa0JBQ3JDLDhEQUFDWixvRUFBa0JBO29CQUFDZSxlQUFlOzs7Ozs7Ozs7Ozs7Ozs7OztBQUs3QyIsInNvdXJjZXMiOlsid2VicGFjazovL2VsZGVybHktaGVhbHRoLWZyb250ZW5kLy4vcGFnZXMvX2FwcC50c3g/MmZiZSJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIE5leHQuanMgQXBwIGNvbXBvbmVudCBmb3IgRWxkZXJseSBIZWFsdGggU3VwcG9ydCBTeXN0ZW1cbiAqL1xuXG5pbXBvcnQgdHlwZSB7IEFwcFByb3BzIH0gZnJvbSBcIm5leHQvYXBwXCI7XG5pbXBvcnQgeyBBdXRoUHJvdmlkZXIgfSBmcm9tIFwiQC9saWIvYXV0aFwiO1xuaW1wb3J0IHsgUXVlcnlDbGllbnQsIFF1ZXJ5Q2xpZW50UHJvdmlkZXIgfSBmcm9tIFwicmVhY3QtcXVlcnlcIjtcbmltcG9ydCB7IFJlYWN0UXVlcnlEZXZ0b29scyB9IGZyb20gXCJyZWFjdC1xdWVyeS9kZXZ0b29sc1wiO1xuaW1wb3J0IHsgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBcIkAvc3R5bGVzL2dsb2JhbHMuY3NzXCI7XG5cbi8vIENyZWF0ZSBhIGNsaWVudFxuY29uc3QgY3JlYXRlUXVlcnlDbGllbnQgPSAoKSA9PlxuICBuZXcgUXVlcnlDbGllbnQoe1xuICAgIGRlZmF1bHRPcHRpb25zOiB7XG4gICAgICBxdWVyaWVzOiB7XG4gICAgICAgIHJldHJ5OiAxLFxuICAgICAgICByZWZldGNoT25XaW5kb3dGb2N1czogZmFsc2UsXG4gICAgICAgIHN0YWxlVGltZTogNSAqIDYwICogMTAwMCwgLy8gNSBtaW51dGVzXG4gICAgICAgIGNhY2hlVGltZTogMTAgKiA2MCAqIDEwMDAsIC8vIDEwIG1pbnV0ZXNcbiAgICAgIH0sXG4gICAgICBtdXRhdGlvbnM6IHtcbiAgICAgICAgcmV0cnk6IDEsXG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9OiBBcHBQcm9wcykge1xuICBjb25zdCBbcXVlcnlDbGllbnRdID0gdXNlU3RhdGUoKCkgPT4gY3JlYXRlUXVlcnlDbGllbnQoKSk7XG5cbiAgcmV0dXJuIChcbiAgICA8QXV0aFByb3ZpZGVyPlxuICAgICAgPFF1ZXJ5Q2xpZW50UHJvdmlkZXIgY2xpZW50PXtxdWVyeUNsaWVudH0+XG4gICAgICAgIDxDb21wb25lbnQgey4uLnBhZ2VQcm9wc30gLz5cbiAgICAgICAge3Byb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcImRldmVsb3BtZW50XCIgJiYgKFxuICAgICAgICAgIDxSZWFjdFF1ZXJ5RGV2dG9vbHMgaW5pdGlhbElzT3Blbj17ZmFsc2V9IC8+XG4gICAgICAgICl9XG4gICAgICA8L1F1ZXJ5Q2xpZW50UHJvdmlkZXI+XG4gICAgPC9BdXRoUHJvdmlkZXI+XG4gICk7XG59XG4iXSwibmFtZXMiOlsiQXV0aFByb3ZpZGVyIiwiUXVlcnlDbGllbnQiLCJRdWVyeUNsaWVudFByb3ZpZGVyIiwiUmVhY3RRdWVyeURldnRvb2xzIiwidXNlU3RhdGUiLCJjcmVhdGVRdWVyeUNsaWVudCIsImRlZmF1bHRPcHRpb25zIiwicXVlcmllcyIsInJldHJ5IiwicmVmZXRjaE9uV2luZG93Rm9jdXMiLCJzdGFsZVRpbWUiLCJjYWNoZVRpbWUiLCJtdXRhdGlvbnMiLCJBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiLCJxdWVyeUNsaWVudCIsImNsaWVudCIsImluaXRpYWxJc09wZW4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

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