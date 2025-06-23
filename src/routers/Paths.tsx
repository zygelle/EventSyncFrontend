
export const pathLogin = '/login'
export const pathRegister = '/cadastro'
export const pathHome = '/'
export const pathFilterEvent = '/evento/buscar'
export const pathViewEvent = `/evento/:id`
export const setPathViewEvent = (id: string) => {
    return `/evento/${id}`
}
export const pathCreateEvents = '/evento/criar'