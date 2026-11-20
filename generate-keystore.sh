#!/bin/bash
# Generar keystore para firmar la release APK
# Ejecuta este script UNA VEZ localmente (necesitas Java instalado)
# Luego sube los secrets a GitHub

set -e

KEYSTORE_FILE="attendance-release.keystore"
KEY_ALIAS="attendance-key"
KEY_PASSWORD="cambia-esta-password"
KEYSTORE_PASSWORD="cambia-esta-password"
VALIDITY_DAYS=10000  # ~27 años

echo "🔐 Generando keystore para firmar APK release..."
echo "Archivo: $KEYSTORE_FILE"
echo "Alias: $KEY_ALIAS"
echo "Validez: $VALIDITY_DAYS días"
echo ""

# Generar keystore
keytool -genkeypair \
    -alias "$KEY_ALIAS" \
    -keyalg RSA \
    -keysize 2048 \
    -validity "$VALIDITY_DAYS" \
    -keystore "$KEYSTORE_FILE" \
    -storepass "$KEYSTORE_PASSWORD" \
    -keypass "$KEY_PASSWORD" \
    -dname "CN=Attendance App, OU=Development, O=MiEmpresa, L=MiCiudad, ST=MiEstado, C=ES" \
    -ext "SAN=dns:localhost,ip:127.0.0.1"

echo ""
echo "✅ Keystore generado: $KEYSTORE_FILE"
echo ""
echo "📋 CONFIGURA ESTOS SECRETS EN GITHUB:"
echo "   Settings > Secrets and variables > Actions > New repository secret"
echo ""
echo "   KEYSTORE_BASE64: $(base64 -w 0 "$KEYSTORE_FILE")"
echo "   KEYSTORE_PASSWORD: $KEYSTORE_PASSWORD"
echo "   KEY_ALIAS: $KEY_ALIAS"
echo "   KEY_PASSWORD: $KEY_PASSWORD"
echo ""
echo "⚠️  GUARDA EL ARCHIVO $KEYSTORE_FILE EN UN LUGAR SEGURO"
echo "   Si lo pierdes, NO PODRÁS ACTUALIZAR LA APP EN PLAY STORE"