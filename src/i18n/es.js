const es = {
  categories: {
    title: "Categorías",
    subtitle:
      "Gestiona las categorías de documentos para organización y filtrado.",

    buttons: {
      create: "Crear categoría",
      cancel: "Cancelar",
      save: "Guardar cambios",
      creating: "Creando...",
      saving: "Guardando...",
      edit: "Editar",
      deactivate: "Desactivar",
      reactivate: "Reactivar",
      processing: "Procesando...",
    },

    messages: {
      loading: "Cargando categorías...",
      empty: "No se encontraron categorías.",
      created: "Categoría creada correctamente.",
      updated: "Categoría actualizada correctamente.",
      deactivated: "Categoría desactivada correctamente.",
      reactivated: "Categoría reactivada correctamente.",
      createError: "Error al crear la categoría.",
      updateError: "Error al actualizar la categoría.",
      deactivateError: "Error al desactivar la categoría.",
      reactivateError: "Error al reactivar la categoría.",
      loadError: "Error al cargar las categorías.",
      unexpected: "Ocurrió un error inesperado.",
    },

    form: {
      createTitle: "Crear categoría",
      editTitle: "Editar categoría",
      name: "Nombre",
      description: "Descripción",
    },

    table: {
      name: "Nombre",
      description: "Descripción",
      status: "Estado",
      created: "Creado",
      actions: "Acciones",
      active: "Activo",
      inactive: "Inactivo",
      noDescription: "N/A",
    },
  },

  auditLogs: {
    title: "Bitácora de auditoría",
    subtitle:
      "Consulta los registros de actividad del sistema en modo solo lectura.",
    filters: "Filtros",
    allUsers: "Todos los usuarios",
    allActions: "Todas las acciones",
    allModules: "Todos los módulos",
    clearFilters: "Limpiar filtros",
    loading: "Cargando registros...",
    empty: "No se encontraron registros de auditoría.",
    loadError: "Error al cargar los registros de auditoría.",
    showing: "Mostrando",
    of: "de",
    records: "registros",
    page: "Página",
    prev: "Anterior",
    next: "Siguiente",
    pageSize: "Registros por página",
    table: {
      userId: "Id de usuario",
      action: "Acción",
      module: "Módulo",
      entity: "Entidad",
      entityId: "Id de entidad",
      details: "Detalles",
      ip: "IP",
      date: "Fecha",
      notAvailable: "N/A",
    },
  },
  changePassword: {
    title: "Cambiar contraseña",
    subtitle: "Actualiza tu contraseña actual de forma segura.",

    form: {
      currentPassword: "Contraseña actual",
      newPassword: "Nueva contraseña",
      confirmPassword: "Confirmar nueva contraseña",
    },

    buttons: {
      save: "Guardar cambios",
      saving: "Guardando...",
    },

    messages: {
      success: "Contraseña actualizada correctamente.",
      mismatch: "La nueva contraseña y su confirmación no coinciden.",
      error: "Error al cambiar la contraseña.",
      unexpected: "Ocurrió un error inesperado.",
    },
  },
  dashboard: {
    title: "Panel principal",
    welcome: "Bienvenido de nuevo",
    defaultUser: "Usuario",

    loading: "Cargando datos del panel...",
    loadError: "Error al cargar el panel.",
    unexpected: "Ocurrió un error inesperado.",

    cards: {
      documents: "Documentos",
      totalDocuments: "Total de documentos registrados",

      users: "Usuarios",
      totalUsers: "Total de usuarios registrados",

      activeUsers: "Usuarios activos",
      activeUsersDesc: "Cuentas actualmente activas",

      inactiveUsers: "Usuarios inactivos",
      inactiveUsersDesc: "Cuentas actualmente inactivas",
    },

    quickAccess: {
      title: "Acceso rápido",
      documents: "Documentos",
      profile: "Perfil",
      users: "Usuarios",
    },
  },
  users: {
    title: "Usuarios",
    subtitle:
      "Consulta los usuarios registrados y la información de sus cuentas.",

    buttons: {
      create: "Crear usuario",
      cancel: "Cancelar",
      save: "Guardar cambios",
      creating: "Creando...",
      processing: "Procesando...",
      edit: "Editar",
      deactivate: "Desactivar",
      reactivate: "Reactivar",
    },

    form: {
      createTitle: "Crear usuario",
      editTitle: "Editar usuario",
      fullName: "Nombre completo",
      email: "Correo electrónico",
      password: "Contraseña",
      department: "Departamento",
      role: "Rol",
      selectRole: "Seleccionar un rol",
    },

    table: {
      fullName: "Nombre completo",
      email: "Correo",
      department: "Departamento",
      role: "Rol",
      status: "Estado",
      created: "Creado",
      actions: "Acciones",
      active: "Activo",
      inactive: "Inactivo",
      noData: "No se encontraron usuarios.",
      notAvailable: "N/A",
    },

    messages: {
      loading: "Cargando usuarios...",
      created: "Usuario creado correctamente.",
      updated: "Usuario actualizado correctamente.",
      deactivated: "Usuario desactivado correctamente.",
      reactivated: "Usuario reactivado correctamente.",
      loadError: "Error al cargar los usuarios.",
      createError: "Error al crear el usuario.",
      updateError: "Error al actualizar el usuario.",
      deactivateError: "Error al desactivar el usuario.",
      reactivateError: "Error al reactivar el usuario.",
      loadUserDetailsError: "Error al cargar los datos del usuario.",
      unexpected: "Ocurrió un error inesperado.",
      loadingDetails: "Cargando datos del usuario...",
    },
  },
  resetPassword: {
    title: "Restablecer contraseña",
    subtitle:
      "Ingresa tu nueva contraseña para recuperar el acceso a tu cuenta.",

    form: {
      newPassword: "Nueva contraseña",
      confirmPassword: "Confirmar nueva contraseña",
    },

    buttons: {
      submit: "Restablecer contraseña",
      loading: "Restableciendo...",
    },

    messages: {
      success: "Tu contraseña ha sido restablecida correctamente.",
      invalidToken: "El token de restablecimiento es inválido o falta.",
      invalidLink: "El enlace de restablecimiento es inválido o incompleto.",
      mismatch: "La nueva contraseña y su confirmación no coinciden.",
      error: "Error al restablecer la contraseña.",
      unexpected: "Ocurrió un error inesperado.",
    },

    navigation: {
      backToLogin: "Volver al inicio de sesión",
    },
  },
  login: {
    title: "CloudDocs",
    subtitle: "Inicia sesión para acceder a tu panel de gestión de documentos.",

    form: {
      email: "Correo electrónico",
      password: "Contraseña",
      emailPlaceholder: "tu@empresa.com",
      passwordPlaceholder: "Ingresa tu contraseña",
    },

    buttons: {
      submit: "Iniciar sesión",
      loading: "Ingresando...",
    },

    links: {
      forgotPassword: "¿Olvidaste tu contraseña?",
    },

    messages: {
      error: "Error al iniciar sesión.",
      unexpected: "Ocurrió un error inesperado.",
    },

    footer: {
      secureAccess: "Acceso interno seguro solo para usuarios autorizados.",
    },
  },
  forgotPassword: {
    title: "Olvidé mi contraseña",
    subtitle:
      "Ingresa tu correo institucional para recibir un enlace de restablecimiento.",

    form: {
      email: "Correo electrónico",
      emailPlaceholder: "tu@empresa.com",
    },

    buttons: {
      submit: "Enviar enlace de restablecimiento",
      loading: "Enviando...",
    },

    links: {
      backToLogin: "Volver al inicio de sesión",
    },

    messages: {
      success:
        "Las instrucciones para restablecer la contraseña se enviaron correctamente.",
      error:
        "Error al procesar la solicitud de restablecimiento de contraseña.",
      unexpected: "Ocurrió un error inesperado.",
    },
  },
  profile: {
    title: "Mi perfil",
    unavailable: "La información del usuario no está disponible.",

    fields: {
      fullName: "Nombre completo",
      email: "Correo electrónico",
      role: "Rol",
    },

    buttons: {
      changePassword: "Cambiar contraseña",
    },
  },
  documents: {
    title: "Documentos",
    subtitle: "Visualiza los documentos disponibles y accede a sus acciones.",
    accessLevel: "Nivel de acceso",

    buttons: {
      upload: "Subir documento",
      rename: "Renombrar",
      save: "Guardar",
      cancel: "Cancelar",
      preview: "Vista previa",
      download: "Descargar",
      deactivate: "Desactivar",
      reactivate: "Reactivar",
      processing: "Procesando...",
      uploading: "Subiendo...",
      uploadVersion: "Subir versión",
      saving: "Guardando...",
      editVisibility: "Editar visibilidad",
    },

    filters: {
      title: "Búsqueda y filtros",
      search: "Buscar nombre del documento...",
      allCategories: "Todas las categorías",
      month: "Mes",
      year: "Año",
      allTypes: "Todos los tipos",
      all: "Todos",
      pending: "Pendiente",
      defined: "Definido",
      active: "Activo",
      inactive: "Inactivo",
      clear: "Limpiar filtros",
      searchLabel: "Nombre del documento",
      categoryLabel: "Categoría",
      monthLabel: "Mes",
      yearLabel: "Año",
      typeLabel: "Tipo documental",
      expirationLabel: "Expiración",
      statusLabel: "Estado",
    },

    table: {
      name: "Nombre",
      category: "Categoría",
      uploadedBy: "Subido por",
      department: "Departamento",
      type: "Tipo",
      created: "Creado",
      status: "Estado",
      version: "Versión",
      actions: "Acciones",
      active: "Activo",
      inactive: "Inactivo",
      current: "Actual",
      loadingVersions: "Cargando versiones...",
      notAvailable: "N/A",
      noData: "No se encontraron documentos.",
    },

    messages: {
      loading: "Cargando documentos...",
      loadError: "Error al cargar los documentos.",
      unexpected: "Ocurrió un error inesperado.",
      uploadSuccess: "Nueva versión subida correctamente.",
      uploadError: "Error al subir la nueva versión.",
      renameSuccess: "Documento renombrado correctamente.",
      renameError: "Error al renombrar el documento.",
      emptyName: "El nombre del documento no puede estar vacío.",
      deactivateSuccess: "Documento desactivado correctamente.",
      deactivateError: "Error al desactivar el documento.",
      reactivateSuccess: "Documento reactivado correctamente.",
      reactivateError: "Error al reactivar el documento.",
      onlyPdf: "Solo se permiten archivos PDF para nuevas versiones.",
    },
    visibility: {
      departmentsLabel: "Departamentos visibles",
      selectAccessLevel: "Seleccionar nivel de acceso",
    },
    pagination: {
      showing: "Mostrando",
      of: "de",
      prev: "Anterior",
      next: "Siguiente",
    },
  },
  uploadDocument: {
    title: "Subir documento",
    subtitle: "Sube archivos PDF y registra sus metadatos de forma segura.",

    form: {
      file: "Archivo PDF",
      selectedFile: "Archivo seleccionado",
      category: "Seleccionar categoría",
      documentType: "Seleccionar tipo de documento",
      accessLevel: "Seleccionar nivel de acceso",
      department: "Departamento",
      expirationDate: "Fecha de expiración",
      expirationPending: "Fecha de expiración pendiente de definición",
      visibleDepartments: "Departamentos visibles",
    },

    buttons: {
      submit: "Subir documento",
      uploading: "Subiendo...",
      reset: "Restablecer",
    },

    messages: {
      loadingCategories: "Cargando categorías...",
      loadCategoriesError: "Error al cargar las categorías.",
      onlyPdf: "Solo se permiten archivos PDF.",
      fileTooLarge:
        "El archivo seleccionado excede el tamaño máximo permitido.",
      selectFile: "Seleccione un archivo PDF.",
      selectCategory: "Seleccione una categoría.",
      selectType: "Seleccione un tipo de documento.",
      selectAccess: "Seleccione un nivel de acceso.",
      expirationRequired:
        "Proporcione una fecha de expiración o márquela como pendiente.",
      success: "Documento subido correctamente.",
      uploadError: "Error al subir el documento.",
      unexpected: "Ocurrió un error inesperado.",
      loadingDepartments: "Cargando departamentos...",
      noDepartments: "No hay departamentos disponibles.",
      selectDepartments: "Seleccione al menos un departamento.",
    },
  },
  uploadDocument: {
    title: "Subir documento",
    subtitle: "Sube archivos PDF y registra sus metadatos de forma segura.",

    form: {
      file: "Archivo PDF",
      selectedFile: "Archivo seleccionado",
      category: "Seleccionar categoría",
      documentType: "Seleccionar tipo de documento",
      accessLevel: "Seleccionar nivel de acceso",
      department: "Departamento",
      expirationDate: "Fecha de expiración",
      expirationPending: "Fecha de expiración pendiente de definición",
    },

    buttons: {
      submit: "Subir documento",
      uploading: "Subiendo...",
      reset: "Restablecer",
    },

    messages: {
      loadingCategories: "Cargando categorías...",
      loadCategoriesError: "Error al cargar las categorías.",
      onlyPdf: "Solo se permiten archivos PDF.",
      fileTooLarge:
        "El archivo seleccionado excede el tamaño máximo permitido.",
      selectFile: "Seleccione un archivo PDF.",
      selectCategory: "Seleccione una categoría.",
      selectType: "Seleccione un tipo de documento.",
      selectAccess: "Seleccione un nivel de acceso.",
      expirationRequired:
        "Proporcione una fecha de expiración o márquela como pendiente.",
      success: "Documento subido correctamente.",
      uploadError: "Error al subir el documento.",
      unexpected: "Ocurrió un error inesperado.",
    },
  },
  documentTypes: {
    title: "Tipos documentales",
    subtitle: "Gestiona los tipos documentales disponibles en el sistema.",

    buttons: {
      create: "Crear tipo documental",
      cancel: "Cancelar",
      save: "Guardar cambios",
      creating: "Creando...",
      saving: "Guardando...",
      edit: "Editar",
      deactivate: "Desactivar",
      reactivate: "Reactivar",
      processing: "Procesando...",
    },

    form: {
      createTitle: "Crear tipo documental",
      editTitle: "Editar tipo documental",
      name: "Nombre",
      description: "Descripción",
    },

    table: {
      name: "Nombre",
      description: "Descripción",
      status: "Estado",
      created: "Creado",
      actions: "Acciones",
      active: "Activo",
      inactive: "Inactivo",
      noDescription: "N/A",
      noData: "No se encontraron tipos documentales.",
    },

    messages: {
      loading: "Cargando tipos documentales...",
      created: "Tipo documental creado correctamente.",
      updated: "Tipo documental actualizado correctamente.",
      deactivated: "Tipo documental desactivado correctamente.",
      reactivated: "Tipo documental reactivado correctamente.",
      loadError: "Error al cargar los tipos documentales.",
      createError: "Error al crear el tipo documental.",
      updateError: "Error al actualizar el tipo documental.",
      deactivateError: "Error al desactivar el tipo documental.",
      reactivateError: "Error al reactivar el tipo documental.",
      unexpected: "Ocurrió un error inesperado.",
    },
  },
  notFound: {
    title: "Página no encontrada",
    description: "La página que estás buscando no existe o fue movida.",
    back: "Volver al panel",
  },
  navbar: {
    welcome: "Bienvenido",
    defaultUser: "Usuario",

    links: {
      dashboard: "Panel",
      documents: "Documentos",
      profile: "Perfil",
      users: "Usuarios",
      categories: "Categorías",
      documentTypes: "Tipos documentales",
      auditLogs: "Auditoría",
      documentAccessLevels: "Niveles de acceso",
      departments: "Departamentos",
    },

    buttons: {
      logout: "Cerrar sesión",
    },
  },
  documentAccessLevels: {
    title: "Niveles de acceso documental",
    subtitle: "Gestiona los niveles de acceso disponibles para los documentos.",

    buttons: {
      create: "Crear nivel de acceso",
      cancel: "Cancelar",
      save: "Guardar cambios",
      creating: "Creando...",
      saving: "Guardando...",
      edit: "Editar",
      deactivate: "Desactivar",
      reactivate: "Reactivar",
      processing: "Procesando...",
    },

    form: {
      createTitle: "Crear nivel de acceso",
      editTitle: "Editar nivel de acceso",
      name: "Nombre",
      description: "Descripción",
    },

    table: {
      name: "Nombre",
      description: "Descripción",
      status: "Estado",
      created: "Creado",
      actions: "Acciones",
      active: "Activo",
      inactive: "Inactivo",
      noDescription: "N/A",
      noData: "No se encontraron niveles de acceso.",
    },

    messages: {
      loading: "Cargando niveles de acceso...",
      created: "Nivel de acceso creado correctamente.",
      updated: "Nivel de acceso actualizado correctamente.",
      deactivated: "Nivel de acceso desactivado correctamente.",
      reactivated: "Nivel de acceso reactivado correctamente.",
      loadError: "Error al cargar los niveles de acceso.",
      createError: "Error al crear el nivel de acceso.",
      updateError: "Error al actualizar el nivel de acceso.",
      deactivateError: "Error al desactivar el nivel de acceso.",
      reactivateError: "Error al reactivar el nivel de acceso.",
      unexpected: "Ocurrió un error inesperado.",
    },
  },
  departments: {
    title: "Departamentos",
    subtitle: "Gestiona los departamentos disponibles en el sistema.",

    buttons: {
      create: "Crear departamento",
      cancel: "Cancelar",
      save: "Guardar cambios",
      creating: "Creando...",
      saving: "Guardando...",
      edit: "Editar",
      deactivate: "Desactivar",
      reactivate: "Reactivar",
      processing: "Procesando...",
    },

    form: {
      createTitle: "Crear departamento",
      editTitle: "Editar departamento",
      name: "Nombre",
      description: "Descripción",
    },

    table: {
      name: "Nombre",
      description: "Descripción",
      status: "Estado",
      created: "Creado",
      actions: "Acciones",
      active: "Activo",
      inactive: "Inactivo",
      noDescription: "N/A",
      noData: "No se encontraron departamentos.",
    },

    messages: {
      loading: "Cargando departamentos...",
      created: "Departamento creado correctamente.",
      updated: "Departamento actualizado correctamente.",
      deactivated: "Departamento desactivado correctamente.",
      reactivated: "Departamento reactivado correctamente.",
      loadError: "Error al cargar los departamentos.",
      createError: "Error al crear el departamento.",
      updateError: "Error al actualizar el departamento.",
      deactivateError: "Error al desactivar el departamento.",
      reactivateError: "Error al reactivar el departamento.",
      unexpected: "Ocurrió un error inesperado.",
    },
  },
  underConstruction: {
    title: "En construcción",
    description:
      "Esta funcionalidad aún no está disponible en esta versión demo.",
    back: "Volver al login",
  },
};

export default es;
