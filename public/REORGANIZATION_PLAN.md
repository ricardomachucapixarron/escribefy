# Plan de Reorganización de Imágenes

## 📁 Nueva Estructura Propuesta

### **Ecos del Mañana** (Sci-Fi)
```
public/users/ricardo-machuca/projects/ecos-manana/
├── characters/
│   ├── maya-chen-lab.png (nueva)
│   ├── maya-chen-vision.png (nueva)
│   ├── marcus-webb.png (nueva)
│   ├── kenji-nakamura.png (nueva)
│   └── shadow-character.png (de character-portraits/)
├── locations/
│   ├── neo-tokyo-skyline.png (de location-images/neo-tokyo.png)
│   ├── quantum-lab.png (nueva)
│   └── central-district.png (nueva)
├── chapters/
│   ├── chapter-1.png (de chapter-images/ecos-ch1.png)
│   └── chapter-2.png (de chapter-images/ecos-ch2.png)
└── cover/
    └── ecos-manana.png (de book-covers/ecos-manana.png)
```

### **Reino de las Sombras** (Fantasy)
```
public/users/ricardo-machuca/projects/reino-sombras/
├── characters/
│   ├── captain-blackwater.png (de character-portraits/)
│   ├── elara-moonweaver.png (de character-portraits/)
│   ├── elder-mage.png (de character-portraits/)
│   ├── kael-stormforge.png (de character-portraits/)
│   ├── king-vorthak.png (de character-portraits/)
│   ├── lady-morgana.png (de character-portraits/)
│   ├── lyra-nightwhisper.png (de character-portraits/)
│   ├── prince-daemon.png (de character-portraits/)
│   ├── queen-seraphina.png (de character-portraits/)
│   ├── sir-marcus.png (de character-portraits/)
│   ├── sister-celestine.png (de character-portraits/)
│   ├── thane-grimjaw.png (de character-portraits/)
│   └── villain-detailed.png (de character-portraits/)
├── locations/
│   ├── umbraluna-city.png (de location-images/)
│   ├── voidheart-ruins.png (de location-images/)
│   ├── enchanted-forest.png (de location-backgrounds/enchanted-forest-bg.png)
│   ├── moonlit-city.png (de location-backgrounds/moonlit-city-bg.png)
│   ├── mystical-landscape.png (de location-backgrounds/mystical-landscape-bg.png)
│   └── steel-fortress.png (de location-backgrounds/steel-fortress-bg.png)
├── chapters/
│   ├── chapter-1.png (de chapter-images/reino-ch1.png)
│   ├── chapter-2.png (de chapter-images/reino-ch2.png)
│   └── chapter-3.png (de chapter-images/reino-ch3.png)
└── cover/
    └── reino-sombras.png (de book-covers/reino-sombras.png)
```

### **Corazones en Conflicto** (Romance/Drama)
```
public/users/ricardo-machuca/projects/corazones-conflicto/
├── characters/
│   └── (por asignar personajes apropiados)
├── locations/
│   └── fantasy-location.png (de location-images/)
├── chapters/
│   └── chapter-1.png (de chapter-images/corazones-ch1.png)
└── cover/
    └── corazones-conflicto.png (de book-covers/corazones-conflicto.png)
```

### **Recursos Compartidos**
```
public/shared/
├── ui-assets/
│   ├── male-sci-fi-writer.png
│   ├── modern-writing-dashboard.png
│   ├── mystical-writing-landscape.png
│   ├── professional-female-lawyer-writer.png
│   └── professional-woman-author.png
├── placeholders/
│   ├── placeholder-logo.png
│   ├── placeholder-user.jpg
│   ├── placeholder.jpg
│   └── placeholder.svg
└── icons/
    ├── file.svg
    ├── globe.svg
    ├── next.svg
    ├── vercel.svg
    └── window.svg
```

## 🔄 Acciones Requeridas

1. **Mover archivos** a nuevas ubicaciones
2. **Actualizar rutas** en todos los JSONs y componentes
3. **Eliminar carpetas antiguas** vacías
4. **Actualizar mockData.ts** con nuevas rutas
5. **Crear datos** para Reino de las Sombras y Corazones en Conflicto

## ✅ Beneficios

- **Organización clara** por proyecto
- **Sin conflictos** de nombres
- **Escalabilidad** para nuevos proyectos
- **Separación** de recursos compartidos vs específicos
- **Mantenimiento** más fácil
