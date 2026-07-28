const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

content = content.replace(
  '  markAllNotificationsAsRead: () => Promise<void>;\n}',
  '  markAllNotificationsAsRead: () => Promise<void>;\n  trainingLogs: any[];\n  setTrainingLogs: React.Dispatch<React.SetStateAction<any[]>>;\n}'
);

content = content.replace(
  '  const [appNotifications, setAppNotifications] = useState<AppNotification[]>([]);',
  '  const [appNotifications, setAppNotifications] = useState<AppNotification[]>([]);\n  const [trainingLogs, setTrainingLogs] = useState<any[]>([]);'
);

content = content.replace(
  '    const unsubNotifications = onSnapshot(collection(db, `users/${userId}/notifications`), (snapshot) => {\n      setAppNotifications(snapshot.docs.map(d => d.data() as AppNotification).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));\n    }, (e) => handleFirestoreError(e, OperationType.LIST, `users/${userId}/notifications`));',
  '    const unsubNotifications = onSnapshot(collection(db, `users/${userId}/notifications`), (snapshot) => {\n      setAppNotifications(snapshot.docs.map(d => d.data() as AppNotification).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));\n    }, (e) => handleFirestoreError(e, OperationType.LIST, `users/${userId}/notifications`));\n\n    const unsubTrainingLogs = onSnapshot(collection(db, `users/${userId}/trainingLog`), (snapshot) => {\n      setTrainingLogs(snapshot.docs.map(d => ({ date: d.id, ...d.data() })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));\n    }, (e) => handleFirestoreError(e, OperationType.LIST, `users/${userId}/trainingLog`));'
);

content = content.replace(
  '      unsubNotifications();\n    };\n  }, [userId, isAuthReady]);',
  '      unsubNotifications();\n      unsubTrainingLogs();\n    };\n  }, [userId, isAuthReady]);'
);

content = content.replace(
  '      markAllNotificationsAsRead\n    }}>\n      {children}\n    </AppContext.Provider>',
  '      markAllNotificationsAsRead,\n      trainingLogs,\n      setTrainingLogs\n    }}>\n      {children}\n    </AppContext.Provider>'
);

fs.writeFileSync('src/context/AppContext.tsx', content);
