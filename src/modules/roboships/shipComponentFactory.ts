import { IShipComponent, createShipComponent } from "./shipcomponent";
import { IPoint } from "./shapeutils";


export default class ShipComponentFactory
{
    static createShipComponent(componentType: string) : IShipComponent
    {
        switch (componentType) {
            case 'hull':
                return ShipComponentFactory.createHull()
            case 'gun':
                return ShipComponentFactory.createGun()
            case 'radar':
                return ShipComponentFactory.createRadar()
            default:
                return createShipComponent()
        }
    }

    static createHull() : IShipComponent
    {
        return ShipComponentBuilder.create()
                                   .withComponentType('hull')
                                   .withMoveable(false)
                                   .withPoints(ShipComponentFactory.createHullPoints(20))
                                   .withVisual('lavender', 'black', 5)
                                   .build()        
    }

    static createGun() : IShipComponent
    {
        return ShipComponentBuilder.create()
                                   .withComponentType('gun')                                   
                                   .withPoints(ShipComponentFactory.createSpeherePoints(8, 16))
                                   .withVisual('indianred', 'black', 2)
                                   .build()
        
    }

    static createRadar() : IShipComponent
    {
        return ShipComponentBuilder.create()
                                   .withComponentType('radar')                                   
                                   .withPoints(ShipComponentFactory.createSpeherePoints(5, 8))
                                   .withVisual('forestgreen', 'black', 2)                               
                                   .build()        
    }

    static createSpeherePoints(radius: number, numberOfPoints: number) : IPoint[]
    {
        let points: IPoint[] = []
        for (let i = 0; i < numberOfPoints; i++) 
        {
            let angle = i * 2 * Math.PI / numberOfPoints;
            let x = radius * Math.cos(angle);
            let y = radius * Math.sin(angle);
            points.push({x: x, y: y})
        }
        return points
    }

    static createHullPoints(size: number) : IPoint[]
    {
        let points: IPoint[] = []
        
        points.push({x: -1 * size, y: -1 * size})
        points.push({x: 0, y: -2 * size})
        points.push({x: 1 * size, y: -1 * size})
        points.push({x: 1 * size, y: 1.5 * size})
        points.push({x: -1 * size, y: 1.5 * size})

        return points
    }

}

class ShipComponentBuilder {
    private componentType: string = "";
    private moveable: boolean = true;
    private points: IPoint[] = [];
    private fillColor: string = "white";
    private strokeColor: string = "black";
    private strokeWidth: number = 1;

    private constructor() {}

    static create(): ShipComponentBuilder {
        return new ShipComponentBuilder();
    }

    withComponentType( componentType: string): ShipComponentBuilder {
        this.componentType = componentType;
        return this;
    }

    withMoveable( moveable: boolean): ShipComponentBuilder {
        this.moveable = moveable;
        return this;
    }

    withPoints( points: IPoint[]): ShipComponentBuilder {
        this.points = points;
        return this;
    }

    withVisual( fillColor: string, strokeColor: string, strokeWidth: number): ShipComponentBuilder {
        this.fillColor = fillColor;
        this.strokeColor = strokeColor;
        this.strokeWidth = strokeWidth;
        return this;
    }         

    build(): IShipComponent {
        const component: IShipComponent = createShipComponent();
        component.componentType = this.componentType;
        component.moveable = this.moveable;
        component.shape = this.points;
        component.fillColor = this.fillColor;
        component.strokeColor = this.strokeColor;
        component.strokeWidth = this.strokeWidth;
        return component;
    }
}