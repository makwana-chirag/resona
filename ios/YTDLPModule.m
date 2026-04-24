#import "YTDLPModule.h"
#import <React/RCTConvert.h>
#import <React/RCTEventEmitter.h>

@implementation YTDLPModule

RCT_EXPORT_MODULE();

// Export method to search YouTube
RCT_EXPORT_METHOD(search:(NSString *)query
                  limit:(nonnull NSNumber *)limit
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    @try {
      NSTask *task = [[NSTask alloc] init];
      task.launchPath = @"/usr/local/bin/yt-dlp";
      task.arguments = @[
        @"--dump-json",
        @"--flat-playlist",
        [NSString stringWithFormat:@"ytsearch%@:%@", limit, query]
      ];
      
      NSPipe *pipe = [NSPipe pipe];
      task.standardOutput = pipe;
      task.standardError = [NSPipe pipe];
      
      [task launch];
      [task waitUntilExit];
      
      NSData *data = [[pipe fileHandleForReading] readDataToEndOfFile];
      NSString *output = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
      
      if (task.terminationStatus == 0) {
        // Parse JSON output
        NSData *jsonData = [output dataUsingEncoding:NSUTF8StringEncoding];
        NSError *error;
        NSArray *results = [NSJSONSerialization JSONObjectWithData:jsonData options:0 error:&error];
        
        if (error) {
          reject(@"parse_error", @"Failed to parse search results", error);
        } else {
          resolve(results);
        }
      } else {
        NSString *errorOutput = [[task.standardError fileHandleForReading] readDataToEndOfFile].stringValue;
        reject(@"search_error", errorOutput ?: @"Unknown search error", nil);
      }
    } @catch (NSException *exception) {
      reject(@"exception", exception.reason, nil);
    }
  });
}

// Export method to get stream URL
RCT_EXPORT_METHOD(getStreamUrl:(NSString *)videoId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    @try {
      NSTask *task = [[NSTask alloc] init];
      task.launchPath = @"/usr/local/bin/yt-dlp";
      task.arguments = @[
        @"--get-url",
        @"-f",
        @"bestaudio",
        [NSString stringWithFormat:@"https://www.youtube.com/watch?v=%@", videoId]
      ];
      
      NSPipe *pipe = [NSPipe pipe];
      task.standardOutput = pipe;
      task.standardError = [NSPipe pipe];
      
      [task launch];
      [task waitUntilExit];
      
      NSData *data = [[pipe fileHandleForReading] readDataToEndOfFile];
      NSString *output = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
      
      if (task.terminationStatus == 0) {
        NSString *streamUrl = [output stringByTrimmingCharactersInSet:[NSCharacterSet newlineCharacterSet]];
        resolve(@{@"streamUrl": streamUrl});
      } else {
        NSString *errorOutput = [[task.standardError fileHandleForReading] readDataToEndOfFile].stringValue;
        reject(@"stream_error", errorOutput ?: @"Unknown stream error", nil);
      }
    } @catch (NSException *exception) {
      reject(@"exception", exception.reason, nil);
    }
  });
}

// Export method to get video info
RCT_EXPORT_METHOD(getInfo:(NSString *)videoId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    @try {
      NSTask *task = [[NSTask alloc] init];
      task.launchPath = @"/usr/local/bin/yt-dlp";
      task.arguments = @[
        @"--dump-json",
        [NSString stringWithFormat:@"https://www.youtube.com/watch?v=%@", videoId]
      ];
      
      NSPipe *pipe = [NSPipe pipe];
      task.standardOutput = pipe;
      task.standardError = [NSPipe pipe];
      
      [task launch];
      [task waitUntilExit];
      
      NSData *data = [[pipe fileHandleForReading] readDataToEndOfFile];
      NSString *output = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
      
      if (task.terminationStatus == 0) {
        NSData *jsonData = [output dataUsingEncoding:NSUTF8StringEncoding];
        NSError *error;
        NSDictionary *info = [NSJSONSerialization JSONObjectWithData:jsonData options:0 error:&error];
        
        if (error) {
          reject(@"parse_error", @"Failed to parse video info", error);
        } else {
          resolve(info);
        }
      } else {
        NSString *errorOutput = [[task.standardError fileHandleForReading] readDataToEndOfFile].stringValue;
        reject(@"info_error", errorOutput ?: @"Unknown info error", nil);
      }
    } @catch (NSException *exception) {
      reject(@"exception", exception.reason, nil);
    }
  });
}

@end
