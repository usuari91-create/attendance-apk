package com.example.attendanceapp;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
import com.capacitorjs.plugins.pushnotifications.PushNotificationsPlugin;
import com.capacitorjs.plugins.localnotifications.LocalNotificationsPlugin;
import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Registrar plugins personalizados
        registerPlugin(PushNotificationsPlugin.class);
        registerPlugin(LocalNotificationsPlugin.class);
    }

    @Override
    protected ArrayList<Class<? extends Plugin>> createPlugins() {
        ArrayList<Class<? extends Plugin>> plugins = super.createPlugins();
        plugins.add(PushNotificationsPlugin.class);
        plugins.add(LocalNotificationsPlugin.class);
        return plugins;
    }
}