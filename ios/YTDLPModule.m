#import "YTDLPModule.h"
#import <React/RCTLog.h>

@implementation YTDLPModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(search : (NSString *)query limit : (NSInteger)
                      limit resolver : (RCTPromiseResolveBlock)
                          resolve rejecter : (RCTPromiseRejectBlock)reject) {

  RCTLogInfo(@"Searching for: %@", query);

  // For iOS Simulator - use yt-dlp from /usr/local/bin
  // For physical device - would need alternative approach
  NSString *ytdlpPath = @"/usr/local/bin/yt-dlp";

  // Check if file exists
  NSFileManager *fileManager = [NSFileManager defaultManager];
  if (![fileManager fileExistsAtPath:ytdlpPath]) {
    reject(@"NOT_FOUND", @"yt-dlp not found. Install with: brew install yt-dlp",
           nil);
    return;
  }

  NSTask *task = [[NSTask alloc] init];
  [task setLaunchPath:ytdlpPath];
  [task setArguments:@[
    [NSString stringWithFormat:@"ytsearch%ld:%@", (long)limit, query],
    @"--flat-playlist", @"--dump-json", @"--no-warnings"
  ]];

  NSPipe *pipe = [NSPipe pipe];
  [task setStandardOutput:pipe];
  [task setStandardError:pipe];

  NSFileHandle *file = [pipe fileHandleForReading];

  [task launch];

  NSData *data = [file readDataToEndOfFile];
  NSString *output = [[NSString alloc] initWithData:data
                                           encoding:NSUTF8StringEncoding];

  [task waitUntilExit];

  if ([task terminationStatus] == 0 && output.length > 0) {
    RCTLogInfo(@"Search successful, found results");
    resolve(output);
  } else {
    RCTLogError(@"Search failed: %@", output);
    reject(@"SEARCH_ERROR", output ?: @"Search failed", nil);
  }
}

RCT_EXPORT_METHOD(getStreamUrl : (NSString *)videoId resolver : (
    RCTPromiseResolveBlock)resolve rejecter : (RCTPromiseRejectBlock)reject) {

  RCTLogInfo(@"Getting stream URL for: %@", videoId);

  NSString *ytdlpPath = @"/usr/local/bin/yt-dlp";

  NSFileManager *fileManager = [NSFileManager defaultManager];
  if (![fileManager fileExistsAtPath:ytdlpPath]) {
    reject(@"NOT_FOUND", @"yt-dlp not found", nil);
    return;
  }

  NSTask *task = [[NSTask alloc] init];
  [task setLaunchPath:ytdlpPath];
  [task setArguments:@[
    @"-f", @"bestaudio", @"--get-url",
    [NSString stringWithFormat:@"https://youtube.com/watch?v=%@", videoId]
  ]];

  NSPipe *pipe = [NSPipe pipe];
  [task setStandardOutput:pipe];
  [task setStandardError:pipe];

  NSFileHandle *file = [pipe fileHandleForReading];

  [task launch];

  NSData *data = [file readDataToEndOfFile];
  NSString *streamUrl = [[NSString alloc] initWithData:data
                                              encoding:NSUTF8StringEncoding];

  [task waitUntilExit];

  if ([task terminationStatus] == 0 && streamUrl.length > 0) {
    streamUrl = [streamUrl
        stringByTrimmingCharactersInSet:[NSCharacterSet
                                            whitespaceAndNewlineCharacterSet]];
    RCTLogInfo(@"Got stream URL: %@",
               [streamUrl substringToIndex:MIN(100, streamUrl.length)]);
    resolve(streamUrl);
  } else {
    RCTLogError(@"Failed to get stream URL: %@", streamUrl);
    reject(@"STREAM_ERROR", @"Failed to get stream URL", nil);
  }
}

RCT_EXPORT_METHOD(getInfo : (NSString *)videoId resolver : (
    RCTPromiseResolveBlock)resolve rejecter : (RCTPromiseRejectBlock)reject) {

  RCTLogInfo(@"Getting info for: %@", videoId);

  NSString *ytdlpPath = @"/usr/local/bin/yt-dlp";

  NSFileManager *fileManager = [NSFileManager defaultManager];
  if (![fileManager fileExistsAtPath:ytdlpPath]) {
    reject(@"NOT_FOUND", @"yt-dlp not found", nil);
    return;
  }

  NSTask *task = [[NSTask alloc] init];
  [task setLaunchPath:ytdlpPath];
  [task setArguments:@[
    @"--dump-json",
    [NSString stringWithFormat:@"https://youtube.com/watch?v=%@", videoId]
  ]];

  NSPipe *pipe = [NSPipe pipe];
  [task setStandardOutput:pipe];
  [task setStandardError:pipe];

  NSFileHandle *file = [pipe fileHandleForReading];

  [task launch];

  NSData *data = [file readDataToEndOfFile];
  NSString *output = [[NSString alloc] initWithData:data
                                           encoding:NSUTF8StringEncoding];

  [task waitUntilExit];

  if ([task terminationStatus] == 0 && output.length > 0) {
    resolve(output);
  } else {
    reject(@"INFO_ERROR", @"Failed to get info", nil);
  }
}

// Check if yt-dlp is available
RCT_EXPORT_METHOD(isAvailable : (RCTPromiseResolveBlock)
                      resolve rejecter : (RCTPromiseRejectBlock)reject) {
  NSString *ytdlpPath = @"/usr/local/bin/yt-dlp";
  NSFileManager *fileManager = [NSFileManager defaultManager];
  BOOL exists = [fileManager fileExistsAtPath:ytdlpPath];
  resolve(@(exists));
}

@end