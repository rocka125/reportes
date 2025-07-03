import React, { useEffect, useRef, useState } from 'react';

const CLIENT_ID = '158776891566-t3va05oggm57qu74aek3ni132s1ktlm7.apps.googleusercontent.com';
const DEVELOPER_KEY = 'AIzaSyCZ4mB5scdDatpQIawNuM0RZK-9AwC0XMQ';
const SCOPE = 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/spreadsheets';
const FOLDER_ID = '1HjU8pXY5PitH_AKuMXod70qSs0QMXX9z';

function GoogleDriveViewer() {
  const tokenClientRef = useRef(null);
  const accessTokenRef = useRef(null);
  const [copiedFileId, setCopiedFileId] = useState(null);
  const [copiedFileName, setCopiedFileName] = useState('');
  const [clientName, setClientName] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [shareEmail, setShareEmail] = useState('');
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState('');
  const [isRoaring, setIsRoaring] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Detectar cambios en el tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      
      // Auto-collapse sidebar en móvil
      if (width < 768) {
        setSidebarCollapsed(true);
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Ejecutar al montar
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Colores principales
  const colors = {
    primaryOrange: '#ff6b35',
    secondaryOrange: '#ff8c42',
    accentOrange: '#ffb366',
    darkBg: '#0d0d0d',
    darkCard: '#1a1209',
    lightBg: '#faf7f2',
    lightCard: '#ffffff',
    darkText: '#f8f9fa',
    lightText: '#1a1209',
    border: isDarkMode ? 'rgba(255, 107, 53, 0.2)' : 'rgba(255, 140, 66, 0.2)',
    shadow: isDarkMode ? 'rgba(255, 107, 53, 0.15)' : 'rgba(255, 107, 53, 0.08)',
  };

  const styles = {
    app: {
      minHeight: '100vh',
      background: isDarkMode 
        ? `linear-gradient(135deg, ${colors.darkBg} 0%, ${colors.darkCard} 100%)`
        : `linear-gradient(135deg, ${colors.lightBg} 0%, #f5f5f5 100%)`,
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      color: isDarkMode ? colors.darkText : colors.lightText,
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s ease',
      position: 'relative',
    },

    header: {
      background: `linear-gradient(135deg, ${colors.primaryOrange} 0%, ${colors.secondaryOrange} 100%)`,
      padding: isMobile ? '0.75rem 1rem' : '1rem 2rem',
      boxShadow: `0 4px 20px ${colors.shadow}`,
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(10px)',
    },

    headerContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      maxWidth: '1400px',
      margin: '0 auto',
    },

    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? '0.5rem' : '1rem',
      color: 'white',
    },

    lionIcon: {
      fontSize: isMobile ? '1.8rem' : '2.5rem',
      animation: isRoaring ? 'lionRoar 1s ease-in-out' : 'lionRoar 4s ease-in-out infinite',
      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
    },

    logoText: {
      fontSize: isMobile ? '1.2rem' : '1.8rem',
      fontWeight: '700',
      letterSpacing: '-0.02em',
      margin: 0,
    },

    logoSubtext: {
      fontSize: isMobile ? '0.7rem' : '0.85rem',
      opacity: 0.9,
      fontWeight: '400',
      margin: 0,
      display: isMobile ? 'none' : 'block',
    },

    headerActions: {
      display: 'flex',
      gap: isMobile ? '0.5rem' : '1rem',
      alignItems: 'center',
    },

    mobileMenuButton: {
      display: isMobile ? 'block' : 'none',
      background: 'rgba(255, 255, 255, 0.2)',
      border: 'none',
      color: 'white',
      padding: '0.5rem',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '1.2rem',
      backdropFilter: 'blur(10px)',
    },

    mainContainer: {
      display: 'flex',
      flex: 1,
      maxWidth: '1400px',
      margin: '0 auto',
      width: '100%',
      height: isMobile ? 'calc(100vh - 64px)' : 'calc(100vh - 80px)',
      position: 'relative',
    },

    sidebar: {
      width: isMobile 
        ? (sidebarOpen ? '100%' : '0') 
        : (sidebarCollapsed ? '60px' : (isTablet ? '300px' : '380px')),
      background: isDarkMode 
        ? `linear-gradient(180deg, ${colors.darkCard} 0%, rgba(26, 18, 9, 0.9) 100%)`
        : `linear-gradient(180deg, ${colors.lightCard} 0%, rgba(250, 247, 242, 0.9) 100%)`,
      borderRight: `1px solid ${colors.border}`,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: `4px 0 20px ${colors.shadow}`,
      position: isMobile ? 'fixed' : 'relative',
      top: isMobile ? 0 : 'auto',
      left: isMobile ? 0 : 'auto',
      height: isMobile ? '100vh' : 'auto',
      zIndex: isMobile ? 200 : 'auto',
      overflow: 'hidden',
    },

    sidebarOverlay: {
      display: isMobile && sidebarOpen ? 'block' : 'none',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      zIndex: 150,
    },

    sidebarToggle: {
      position: 'absolute',
      top: '1rem',
      right: isMobile ? '1rem' : '-12px',
      background: `linear-gradient(135deg, ${colors.primaryOrange} 0%, ${colors.secondaryOrange} 100%)`,
      border: 'none',
      borderRadius: '50%',
      width: '24px',
      height: '24px',
      display: isMobile ? 'none' : 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: 'white',
      fontSize: '0.8rem',
      zIndex: 10,
      boxShadow: `0 2px 8px ${colors.shadow}`,
      transition: 'all 0.2s ease',
    },

    mobileCloseButton: {
      display: isMobile ? 'block' : 'none',
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      background: `linear-gradient(135deg, ${colors.primaryOrange} 0%, ${colors.secondaryOrange} 100%)`,
      border: 'none',
      borderRadius: '50%',
      width: '32px',
      height: '32px',
      color: 'white',
      fontSize: '1.2rem',
      cursor: 'pointer',
      zIndex: 10,
    },

    sidebarContent: {
      padding: isMobile 
        ? '3rem 1rem 1rem 1rem'
        : (sidebarCollapsed ? '1rem 0.5rem' : (isTablet ? '1.5rem 1rem' : '2rem 1.5rem')),
      flex: 1,
      overflowY: 'auto',
      transition: 'all 0.3s ease',
    },

    section: {
      marginBottom: isMobile ? '1.5rem' : '2rem',
      opacity: (sidebarCollapsed && !isMobile) ? 0 : 1,
      transition: 'opacity 0.3s ease',
    },

    sectionTitle: {
      fontSize: isMobile ? '1rem' : '1.1rem',
      fontWeight: '600',
      color: isDarkMode ? colors.accentOrange : colors.primaryOrange,
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },

    card: {
      background: isDarkMode 
        ? `linear-gradient(145deg, ${colors.darkCard} 0%, rgba(26, 18, 9, 0.7) 100%)`
        : `linear-gradient(145deg, ${colors.lightCard} 0%, rgba(250, 247, 242, 0.7) 100%)`,
      border: `1px solid ${colors.border}`,
      borderRadius: '16px',
      padding: isMobile ? '1rem' : '1.5rem',
      marginBottom: '1rem',
      boxShadow: `0 4px 12px ${colors.shadow}`,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      backdropFilter: 'blur(10px)',
    },

    inputGroup: {
      marginBottom: '1rem',
    },

    label: {
      display: 'block',
      fontSize: '0.9rem',
      fontWeight: '500',
      marginBottom: '0.5rem',
      color: isDarkMode ? colors.secondaryOrange : colors.primaryOrange,
    },

    input: {
      width: '100%',
      padding: isMobile ? '0.75rem' : '0.8rem 1rem',
      fontSize: isMobile ? '16px' : '0.9rem', // 16px previene zoom en iOS
      border: `1px solid ${colors.border}`,
      borderRadius: '10px',
      background: isDarkMode 
        ? 'rgba(13, 13, 13, 0.3)' 
        : 'rgba(255, 255, 255, 0.7)',
      color: isDarkMode ? colors.darkText : colors.lightText,
      transition: 'all 0.2s ease',
      outline: 'none',
      boxSizing: 'border-box',
    },

    button: {
      background: `linear-gradient(135deg, ${colors.primaryOrange} 0%, ${colors.secondaryOrange} 100%)`,
      color: 'white',
      border: 'none',
      padding: isMobile ? '0.75rem 1rem' : '0.8rem 1.5rem',
      fontSize: isMobile ? '0.8rem' : '0.9rem',
      fontWeight: '500',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: `0 4px 12px ${colors.shadow}`,
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      justifyContent: 'center',
      width: '100%',
      minHeight: '44px', // Mínimo para touch targets
    },

    secondaryButton: {
      background: isDarkMode 
        ? `linear-gradient(135deg, ${colors.darkCard} 0%, rgba(26, 18, 9, 0.8) 100%)`
        : `linear-gradient(135deg, ${colors.lightCard} 0%, rgba(250, 247, 242, 0.8) 100%)`,
      color: isDarkMode ? colors.accentOrange : colors.primaryOrange,
      border: `1px solid ${colors.border}`,
      padding: isMobile ? '0.5rem' : '0.8rem 1.5rem',
      fontSize: isMobile ? '1rem' : '0.9rem',
      fontWeight: '500',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      justifyContent: 'center',
      minHeight: '44px',
    },

    successAlert: {
      background: `linear-gradient(135deg, ${colors.primaryOrange} 0%, ${colors.secondaryOrange} 100%)`,
      color: 'white',
      padding: isMobile ? '0.75rem' : '1rem',
      borderRadius: '12px',
      marginBottom: '1rem',
      fontSize: isMobile ? '0.8rem' : '0.9rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      animation: 'slideIn 0.3s ease-out',
    },

    mainContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: isDarkMode 
        ? `linear-gradient(135deg, ${colors.darkBg} 0%, rgba(13, 13, 13, 0.8) 100%)`
        : `linear-gradient(135deg, ${colors.lightBg} 0%, rgba(250, 247, 242, 0.8) 100%)`,
      width: isMobile ? '100%' : 'auto',
    },

    contentHeader: {
      padding: isMobile ? '1rem' : '1.5rem 2rem',
      borderBottom: `1px solid ${colors.border}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '0.5rem',
    },

    contentTitle: {
      fontSize: isMobile ? '1.1rem' : '1.3rem',
      fontWeight: '600',
      color: isDarkMode ? colors.accentOrange : colors.primaryOrange,
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },

    contentBody: {
      flex: 1,
      padding: isMobile ? '0.5rem' : '1rem',
      display: 'flex',
      flexDirection: 'column',
    },

    iframe: {
      width: '100%',
      height: '100%',
      border: 'none',
      borderRadius: isMobile ? '8px' : '12px',
      background: isDarkMode ? colors.darkCard : colors.lightCard,
      boxShadow: `0 8px 24px ${colors.shadow}`,
      flex: 1,
      minHeight: isMobile ? '400px' : '500px',
    },

    emptyState: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      background: isDarkMode 
        ? `linear-gradient(135deg, rgba(26, 18, 9, 0.3) 0%, rgba(13, 13, 13, 0.5) 100%)`
        : `linear-gradient(135deg, rgba(250, 247, 242, 0.3) 0%, rgba(240, 240, 240, 0.5) 100%)`,
      borderRadius: isMobile ? '8px' : '12px',
      border: `2px dashed ${colors.border}`,
      color: isDarkMode ? colors.secondaryOrange : colors.primaryOrange,
      textAlign: 'center',
      padding: isMobile ? '2rem 1rem' : '3rem',
      margin: isMobile ? '0.5rem' : '0',
    },

    notification: {
      position: 'fixed',
      top: isMobile ? '80px' : '100px',
      right: isMobile ? '1rem' : '2rem',
      left: isMobile ? '1rem' : 'auto',
      background: `linear-gradient(135deg, ${colors.primaryOrange} 0%, ${colors.secondaryOrange} 100%)`,
      color: 'white',
      padding: isMobile ? '0.75rem' : '1rem 1.5rem',
      borderRadius: '12px',
      boxShadow: `0 8px 24px ${colors.shadow}`,
      zIndex: 1000,
      maxWidth: isMobile ? 'calc(100% - 2rem)' : '300px',
      animation: 'slideInRight 0.3s ease-out',
      fontSize: isMobile ? '0.8rem' : '0.9rem',
    },

    loadingSpinner: {
      display: 'inline-block',
      width: '16px',
      height: '16px',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderTop: '2px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },

    statusIndicator: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: copiedFileId ? '#4ade80' : '#ef4444',
      animation: copiedFileId ? 'pulse 2s infinite' : 'none',
    },
  };

  const keyframes = `
    @keyframes lionRoar {
      0%, 100% { transform: scale(1) rotate(0deg); }
      25% { transform: scale(1.1) rotate(-1deg); }
      75% { transform: scale(1.05) rotate(1deg); }
    }
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(100px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    /* Responsive utilities */
    @media (max-width: 767px) {
      .mobile-scroll {
        -webkit-overflow-scrolling: touch;
      }
    }
  `;

  useEffect(() => {
    const loadPicker = () => {
      window.gapi.load('client:picker', () => {
        console.log('✅ Picker API cargada');
      });
    };

    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = loadPicker;
    document.body.appendChild(script);

    tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPE,
      callback: (tokenResponse) => {
        if (tokenResponse.access_token) {
          accessTokenRef.current = tokenResponse.access_token;
          openPicker();
        }
      },
    });
  }, []);

  const handleLogin = () => {
    setIsRoaring(true);
    setTimeout(() => setIsRoaring(false), 1000);
    tokenClientRef.current.requestAccessToken();
  };

  const openPicker = () => {
    const view = new window.google.picker.DocsView()
      .setMimeTypes('application/vnd.google-apps.spreadsheet,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      .setIncludeFolders(true);

    const picker = new window.google.picker.PickerBuilder()
      .setOAuthToken(accessTokenRef.current)
      .setDeveloperKey(DEVELOPER_KEY)
      .addView(view)
      .setCallback(async (data) => {
        if (data.action === window.google.picker.Action.PICKED) {
          const doc = data.docs[0];
          const originalId = doc.id;
          const originalName = doc.name;

          const dateStr = new Date().toISOString().split('T')[0];
          const newFileName = `Reporte_Fortress8_${clientName}_${dateStr}.xlsx`;
          const copied = await copyFile(originalId, newFileName);
          setCopiedFileId(copied.id);
          setCopiedFileName(newFileName);
          
          // Cerrar sidebar en móvil después de seleccionar
          if (isMobile) {
            setSidebarOpen(false);
          }
        }
      })
      .build();

    picker.setVisible(true);
  };

  const copyFile = async (fileId, newName) => {
    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/copy`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessTokenRef.current}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: newName,
        mimeType: 'application/vnd.google-apps.spreadsheet',
        parents: [FOLDER_ID],
      }),
    });
    return await response.json();
  };

  const forceSave = async () => {
    if (!copiedFileId) return alert('No hay archivo copiado para guardar');

    try {
      await fetch(`https://www.googleapis.com/drive/v3/files/${copiedFileId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessTokenRef.current}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: `Última confirmación de guardado: ${new Date().toISOString()}`,
        }),
      });
      setNotification('💾 Guardado confirmado');
      setTimeout(() => setNotification(''), 3000);
    } catch (error) {
      setNotification('❌ Error al guardar');
      setTimeout(() => setNotification(''), 3000);
    }
  };

  const shareAsPdfWithUser = async () => {
    if (!copiedFileId) return alert('No hay archivo copiado');
    if (!shareEmail) return alert('Ingresa un email válido');

    try {
      setUploading(true);
      const dateStr = new Date().toISOString().split('T')[0];
      const exportUrl = `https://docs.google.com/spreadsheets/d/${copiedFileId}/export?format=pdf&portrait=true&size=A4&scale=4&top_margin=0.20&bottom_margin=0.20&left_margin=0.20&right_margin=0.20&horizontal_alignment=CENTER&vertical_alignment=TOP&sheetnames=false&printtitle=false&pagenumbers=false&gridlines=false&fzr=false`;

      const pdfResponse = await fetch(exportUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessTokenRef.current}`,
        },
      });

      const pdfBlob = await pdfResponse.blob();

      const metadata = {
        name: `Reporte_Fortress8_${clientName}_${dateStr}.pdf`,
        mimeType: 'application/pdf',
        parents: [FOLDER_ID],
      };

      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', pdfBlob);

      const uploadResponse = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessTokenRef.current}`,
        },
        body: form,
      });

      const uploadedFile = await uploadResponse.json();

      const permissionResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${uploadedFile.id}/permissions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessTokenRef.current}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: 'reader',
          type: 'user',
          emailAddress: shareEmail,
        }),
      });

      if (permissionResponse.ok) {
        setNotification(`✅ PDF enviado a ${shareEmail}`);
        setShareEmail('');
        if (isMobile) {
          setSidebarOpen(false);
        }
      } else {
        setNotification('❌ Error al enviar PDF');
      }
    } catch (error) {
      setNotification('❌ Error al procesar PDF');
    } finally {
      setUploading(false);
      setTimeout(() => setNotification(''), 3000);
    }
  };

  return (
    <div style={styles.app}>
      <style>{keyframes}</style>
      
      {/* Overlay para móvil */}
      <div 
        style={styles.sidebarOverlay}
        onClick={() => setSidebarOpen(false)}
      />
      
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <button 
              style={styles.mobileMenuButton}
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>
            <div style={styles.lionIcon}>🦁</div>
            <div>
              <h1 style={styles.logoText}>Fortress8</h1>
              <p style={styles.logoSubtext}>Sistema de Reportes Empresariales</p>
            </div>
          </div>
          <div style={styles.headerActions}>
            <div style={styles.statusIndicator}></div>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              style={styles.secondaryButton}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div style={styles.mainContainer}>
        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={styles.sidebarToggle}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
          
          <button 
            onClick={() => setSidebarOpen(false)}
            style={styles.mobileCloseButton}
          >
            ×
          </button>
          
          <div style={styles.sidebarContent} className="mobile-scroll">
            {((!sidebarCollapsed && !isMobile) || (isMobile && sidebarOpen)) && (
              <>
                {/* Client Configuration */}
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>
                    🏢 Cliente
                  </h3>
                  <div style={styles.card}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Nombre del Cliente</label>
                      <input
                        type="text"
                        placeholder="Ingresa el nombre del cliente"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        style={styles.input}
                      />
                    </div>
                    <button 
                      onClick={handleLogin} 
                      style={styles.button}
                    >
                      📂 Seleccionar Archivo
                    </button>
                  </div>
                </div>

                {/* File Management */}
                {copiedFileId && (
                  <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>
                      💾 Archivo
                    </h3>
                    <div style={styles.successAlert}>
                      <span>✅</span>
                      <div>
                        <div style={{ fontWeight: '600' }}>Archivo listo</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                          {copiedFileName}
                        </div>
                      </div>
                    </div>
                    <div style={styles.card}>
                      <button 
                        onClick={forceSave} 
                        style={styles.button}
                      >
                        💾 Guardar Cambios
                      </button>
                    </div>
                  </div>
                )}

                {/* PDF Sharing */}
                {copiedFileId && (
                  <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>
                      📧 Compartir
                    </h3>
                    <div style={styles.card}>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Email</label>
                        <input
                          type="email"
                          placeholder="destinatario@empresa.com"
                          value={shareEmail}
                          onChange={(e) => setShareEmail(e.target.value)}
                          style={styles.input}
                        />
                      </div>
                      <button 
                        onClick={shareAsPdfWithUser} 
                        disabled={uploading}
                        style={{
                          ...styles.button,
                          opacity: uploading ? 0.7 : 1,
                          cursor: uploading ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {uploading ? <div style={styles.loadingSpinner}></div> : '📨'}
                        {uploading ? 'Enviando...' : 'Enviar PDF'}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main style={styles.mainContent}>
          <div style={styles.contentHeader}>
            <h2 style={styles.contentTitle}>
              📊 Editor de Reportes
            </h2>
            {copiedFileId && (
              <div style={{ 
                fontSize: isMobile ? '0.8rem' : '0.9rem', 
                color: isDarkMode ? colors.secondaryOrange : colors.primaryOrange,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <div style={styles.statusIndicator}></div>
                {isMobile ? 'Editando' : 'Editando archivo'}
              </div>
            )}
          </div>
          
          <div style={styles.contentBody}>
            {copiedFileId ? (
              <iframe
                title="Google Sheet Editor"
                src={`https://docs.google.com/spreadsheets/d/${copiedFileId}/edit?usp=sharing`}
                style={styles.iframe}
              />
            ) : (
              <div style={styles.emptyState}>
                <div style={{ fontSize: isMobile ? '3rem' : '4rem', marginBottom: '1rem' }}>🦁</div>
                <h3 style={{ 
                  margin: '0 0 0.5rem 0', 
                  fontSize: isMobile ? '1rem' : '1.2rem' 
                }}>
                  Bienvenido a Fortress8
                </h3>
                <p style={{ 
                  margin: 0, 
                  opacity: 0.8,
                  fontSize: isMobile ? '0.8rem' : '0.9rem'
                }}>
                  {isMobile ? 'Toca el menú para comenzar' : 'Selecciona un archivo de Google Drive para comenzar a editarlo'}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Notifications */}
      {notification && (
        <div style={styles.notification}>
          {notification}
        </div>
      )}
    </div>
  );
}

export default GoogleDriveViewer;