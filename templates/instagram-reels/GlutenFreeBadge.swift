import Foundation
import CoreGraphics
import CoreText

/// Coordinates in a 1080 x 1920 canvas. Use on the first shot only; fixed badge afterwards.
struct GlutenFreeBadge {
 let config:[String:Any]
 init(configuration:URL) throws {
  config=try JSONSerialization.jsonObject(with:Data(contentsOf:configuration)) as! [String:Any]
 }
 func number(_ key:String)->CGFloat {CGFloat((config[key] as! NSNumber).doubleValue)}
 /// Approved v2 palettes share one motion; the terracotta header inverts the entering stamp.
 func drawThemed(_ c:CGContext, time t:Double, animated:Bool, canvasHeight H:CGFloat, accent:CGColor, cream:CGColor, font:CTFont) {
  draw(c,time:t,animated:animated,canvasHeight:H,accent:accent,cream:cream,font:font)
  if config["headerBackground"] as? String == "terracotta" {
   let headerHeight=number("headerHeight")
   c.saveGState();c.clip(to:CGRect(x:0,y:H-headerHeight,width:1080,height:headerHeight))
   draw(c,time:t,animated:animated,canvasHeight:H,accent:cream,cream:accent,font:font)
   c.restoreGState()
  }
 }
func draw(_ c:CGContext, time t:Double, animated:Bool, canvasHeight H:CGFloat, accent:CGColor, cream:CGColor, font:CTFont) {
 let phase=animated ? max(0,min(1,(t-Double(number("holdSeconds")))/Double(number("travelSeconds")))):1
 let u=CGFloat(phase), eased=u*u*(3-2*u)
 let scale=1+(number("startScale")-1)*(1-eased)
 let cx=number("startCenterX")+(number("endCenterX")-number("startCenterX"))*eased
 let ty=number("startCenterTop")+(number("endCenterTop")-number("startCenterTop"))*eased
 let bw=number("width"),bh=number("height")
 c.saveGState();c.translateBy(x:cx,y:H-ty);c.rotate(by:number("startAngleDegrees") * .pi/180*(1-eased));c.scaleBy(x:scale,y:scale)
 let rect=CGRect(x:-bw/2,y:-bh/2,width:bw,height:bh)
 c.setFillColor(accent);c.addPath(CGPath(roundedRect:rect,cornerWidth:8,cornerHeight:8,transform:nil));c.fillPath()
 // Inset rule reads as a stamp initially and disappears as it becomes the badge.
 if animated && eased<1 {
  c.setStrokeColor(cream.copy(alpha:0.82*(1-eased))!);c.setLineWidth(1.5);c.stroke(rect.insetBy(dx:7,dy:7))
 }
 var attrs:[NSAttributedString.Key:Any]=[NSAttributedString.Key(kCTFontAttributeName as String):font,NSAttributedString.Key(kCTForegroundColorAttributeName as String):cream]
 // Opt-in tracking for documented post variants; absent in the approved default.
 if let tracking=config["letterSpacing"] as? NSNumber {
  attrs[NSAttributedString.Key(kCTKernAttributeName as String)]=tracking.doubleValue
 }
 // Localised variants reuse the same geometry and motion; legacy configs stay Ukrainian.
 let label=config["text"] as? String ?? "БЕЗ ГЛЮТЕНУ"
 let line=CTLineCreateWithAttributedString(NSAttributedString(string:label,attributes:attrs))
 let inkBox=CTLineGetBoundsWithOptions(line,[.useGlyphPathBounds])
 precondition(inkBox.width<bw-48 && inkBox.height<bh-24,"Badge text overflow")
 c.textMatrix = .identity;c.textPosition=CGPoint(x:-inkBox.midX,y:-inkBox.midY);CTLineDraw(line,c)
 c.restoreGState()
}

}
