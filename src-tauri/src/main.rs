// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

use tauri::Window;
use std::thread;
use std::time::Duration;

#[derive(Clone, serde::Serialize)]
struct Payload {
  message: String,
}




#[tauri::command]
fn init_process(window: Window, seconds: u64) {
  println!("Starting the process with {} seconds interval", seconds);
  std::thread::spawn(move || {
    loop {
      window.emit("event-name", Payload { message: "Tauri is awesome!".into() }).unwrap();
      thread::sleep(Duration::from_secs(seconds));
    }
  });
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![init_process])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
