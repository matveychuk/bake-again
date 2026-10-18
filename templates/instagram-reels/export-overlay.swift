import Foundation
import CoreGraphics
import CoreText
import ImageIO
import UniformTypeIdentifiers

@main struct ExportOverlay {
 static func main() throws {
  let root=URL(fileURLWithPath:CommandLine.arguments[1]), out=URL(fileURLWithPath:CommandLine.arguments[2])
  let configName=CommandLine.arguments.count>3 ? CommandLine.arguments[3]:"badge-horizontal-v2-cream.json"
  let badge=try GlutenFreeBadge(configuration:root.appendingPathComponent(configName))
  let fontFile=badge.config["font"] as? String ?? "Manrope-Semibold.ttf"
  let fontURL=root.deletingLastPathComponent().appendingPathComponent("recipe-pdf/fonts/\(fontFile)")
  let desc=CTFontManagerCreateFontDescriptorsFromURL(fontURL as CFURL) as! [CTFontDescriptor]
  let font=CTFontCreateWithFontDescriptor(desc[0],badge.number("fontSize"),nil)
  let cs=CGColorSpace(name:CGColorSpace.sRGB)!
  let css=try String(contentsOf:root.deletingLastPathComponent().deletingLastPathComponent().appendingPathComponent("design-system/tokens.css"),encoding:.utf8)
  func color(_ token:String)->CGColor {
   let regex=try! NSRegularExpression(pattern:"--"+token+":\\s*#([0-9a-fA-F]{6})")
   let match=regex.firstMatch(in:css,range:NSRange(css.startIndex...,in:css))!
   let n=UInt32(String(css[Range(match.range(at:1),in:css)!]),radix:16)!
   return CGColor(red:CGFloat((n>>16)&255)/255,green:CGFloat((n>>8)&255)/255,blue:CGFloat(n&255)/255,alpha:1)
  }
  try FileManager.default.createDirectory(at:out,withIntermediateDirectories:true)
  for frame in 0..<60 {
   let c=CGContext(data:nil,width:1080,height:1920,bitsPerComponent:8,bytesPerRow:0,space:cs,bitmapInfo:CGImageAlphaInfo.premultipliedLast.rawValue)!
   c.clear(CGRect(x:0,y:0,width:1080,height:1920))
   badge.drawThemed(c,time:Double(frame)/30,animated:true,canvasHeight:1920,accent:color("color-action-primary-strong"),cream:color("color-background-page"),font:font)
   let dest=CGImageDestinationCreateWithURL(out.appendingPathComponent(String(format:"stamp-%03d.png",frame)) as CFURL,UTType.png.identifier as CFString,1,nil)!
   CGImageDestinationAddImage(dest,c.makeImage()!,nil);precondition(CGImageDestinationFinalize(dest))
  }
  print("60 transparent PNG frames at 30fps exported")
 }
}
