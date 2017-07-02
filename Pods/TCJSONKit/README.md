# TCJSONKit

#### Podfile

```ruby
platform :ios, '7.0'
pod "TCJSONKit"
```

#### Usage
```Objective-C
#import <TCJSONKit.h>

...
...
...

NSString *string = @"{\"number\":0}";
NSLog(@"%@", [string JSONObject]);
    
NSDictionary *dict = @{@"number" : @0};
NSLog(@"%@", [dict JSONString]);
    
id array = @[@0];
NSLog(@"%@", [array JSONString]);

```
