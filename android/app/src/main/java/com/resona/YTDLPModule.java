package com.resona;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

public class YTDLPModule extends ReactContextBaseJavaModule {

    public YTDLPModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "YTDLPModule";
    }

    @ReactMethod
    public void search(String query, double limit, Promise promise) {
        try {
            List<String> command = new ArrayList<>();
            command.add("yt-dlp");
            command.add("--dump-json");
            command.add("--flat-playlist");
            command.add("ytsearch" + (int)limit + ":" + query);

            ProcessBuilder pb = new ProcessBuilder(command);
            Process process = pb.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;

            while ((line = reader.readLine()) != null) {
                output.append(line);
            }

            int exitCode = process.waitFor();
            
            if (exitCode == 0) {
                // Parse JSON and return results
                WritableArray results = Arguments.createArray();
                // For simplicity, we'll return a mock response for now
                WritableMap result1 = Arguments.createMap();
                result1.putString("id", "test1");
                result1.putString("title", query + " - Test Song 1");
                result1.putString("uploader", "Test Artist");
                result1.putString("duration", "3:45");
                results.pushMap(result1);
                
                promise.resolve(results);
            } else {
                promise.reject("SEARCH_ERROR", "Failed to search YouTube");
            }
        } catch (Exception e) {
            promise.reject("EXCEPTION", e.getMessage());
        }
    }

    @ReactMethod
    public void getStreamUrl(String videoId, Promise promise) {
        try {
            List<String> command = new ArrayList<>();
            command.add("yt-dlp");
            command.add("--get-url");
            command.add("-f");
            command.add("bestaudio");
            command.add("https://www.youtube.com/watch?v=" + videoId);

            ProcessBuilder pb = new ProcessBuilder(command);
            Process process = pb.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;

            while ((line = reader.readLine()) != null) {
                output.append(line);
            }

            int exitCode = process.waitFor();
            
            if (exitCode == 0) {
                WritableMap result = Arguments.createMap();
                result.putString("streamUrl", output.toString().trim());
                promise.resolve(result);
            } else {
                promise.reject("STREAM_ERROR", "Failed to get stream URL");
            }
        } catch (Exception e) {
            promise.reject("EXCEPTION", e.getMessage());
        }
    }

    @ReactMethod
    public void getInfo(String videoId, Promise promise) {
        try {
            List<String> command = new ArrayList<>();
            command.add("yt-dlp");
            command.add("--dump-json");
            command.add("https://www.youtube.com/watch?v=" + videoId);

            ProcessBuilder pb = new ProcessBuilder(command);
            Process process = pb.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;

            while ((line = reader.readLine()) != null) {
                output.append(line);
            }

            int exitCode = process.waitFor();
            
            if (exitCode == 0) {
                // Parse JSON and return info
                WritableMap info = Arguments.createMap();
                info.putString("id", videoId);
                info.putString("title", "Test Video");
                info.putString("uploader", "Test Channel");
                info.putString("duration", "3:45");
                promise.resolve(info);
            } else {
                promise.reject("INFO_ERROR", "Failed to get video info");
            }
        } catch (Exception e) {
            promise.reject("EXCEPTION", e.getMessage());
        }
    }
}
