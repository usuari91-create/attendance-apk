# ProGuard rules for Attendance App

# Keep Firebase classes
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }

# Keep Capacitor classes
-keep class com.getcapacitor.** { *; }
-keep class com.capacitorjs.** { *; }

# Keep Kotlin coroutines
-keep class kotlinx.coroutines.** { *; }

# Keep WebView JavaScript interface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep Firebase Firestore
-keep class com.google.firebase.firestore.** { *; }
-keep class com.google.firebase.auth.** { *; }

# Keep Protobuf (used by Firestore)
-keep class com.google.protobuf.** { *; }

# Keep OkHttp/Okio (network)
-keep class okhttp3.** { *; }
-keep class okio.** { *; }

# Keep Gson (if used)
-keep class com.google.gson.** { *; }

# Keep Kotlin stdlib
-keep class kotlin.** { *; }

# Keep AndroidX
-keep class androidx.** { *; }

# Keep Material Components
-keep class com.google.android.material.** { *; }

# Keep our app classes
-keep class com.example.attendanceapp.** { *; }

# Optimizations
-optimizationpasses 5
-allowaccessmodification
-dontpreverify

# Keep annotations
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes EnclosingMethod
-keepattributes InnerClasses