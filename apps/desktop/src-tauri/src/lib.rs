use serde::Serialize;

#[derive(Serialize)]
struct DeviceScan {
    device_name: String,
    device_type: String,
    profile: String,
    signal_strength: i32,
}

#[derive(Serialize)]
struct DesktopMetrics {
    screen_time_minutes: i32,
    keyboard_intensity: i32,
    mouse_intensity: i32,
    focus_score: i32,
    stress_proxy: i32,
}

#[tauri::command]
fn scan_bluetooth_devices() -> Vec<DeviceScan> {
    vec![
        DeviceScan {
            device_name: "PulseBand Horizon".into(),
            device_type: "Smartwatch".into(),
            profile: "Heart Rate".into(),
            signal_strength: -48,
        },
        DeviceScan {
            device_name: "CardioCheck USB-Cuff".into(),
            device_type: "Blood Pressure Cuff".into(),
            profile: "USB Peripheral".into(),
            signal_strength: -61,
        },
        DeviceScan {
            device_name: "GlucoTrack Mini".into(),
            device_type: "Glucose Monitor".into(),
            profile: "Glucose".into(),
            signal_strength: -54,
        },
    ]
}

#[tauri::command]
fn get_desktop_metrics() -> DesktopMetrics {
    DesktopMetrics {
        screen_time_minutes: 312,
        keyboard_intensity: 71,
        mouse_intensity: 64,
        focus_score: 82,
        stress_proxy: 43,
    }
}

#[tauri::command]
fn list_usb_peripherals() -> Vec<String> {
    vec![
        "USB Pulse Oximeter".into(),
        "Serial Blood Pressure Cuff".into(),
        "HID Keyboard Activity Monitor".into(),
    ]
}

#[tauri::command]
fn notify_desktop(message: String) -> String {
    format!("Desktop notification queued: {}", message)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            scan_bluetooth_devices,
            get_desktop_metrics,
            list_usb_peripherals,
            notify_desktop
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
