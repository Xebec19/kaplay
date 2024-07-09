import type { Texture } from "../../gfx";
import { getKaboomContext } from "../../kaboom";
import { Polygon } from "../../math";
import { type Color } from "../../math/color";
import type {
    Comp,
    DrawPolygonOpt,
    GameObj,
    KaboomCtx,
    Vec2,
} from "../../types";

/**
 * The {@link polygon `polygon()`} component.
 *
 * @since v3001.0
 * @group Component Types
 */
export interface PolygonComp extends Comp {
    draw: Comp["draw"];
    /**
     * Points in the polygon.
     */
    pts: Vec2[];
    /**
     * The radius of each corner.
     */
    radius?: number | number[];
    /**
     * The color of each vertex.
     */
    colors?: Color[];
    /**
     * The uv of each vertex.
     *
     * @since v3001.0
     */
    uv?: Vec2[];
    /**
     * The texture used when uv coordinates are present.
     *
     * @since v3001.0
     */
    tex?: Texture;
    renderArea(): Polygon;
}

/**
 * Options for the {@link polygon `polygon()`} component.
 *
 * @group Component Types
 */
export type PolygonCompOpt = Omit<DrawPolygonOpt, "pts">;

export function polygon(
    this: KaboomCtx,
    pts: Vec2[],
    opt: PolygonCompOpt = {},
): PolygonComp {
    const k = getKaboomContext(this);
    const { getRenderProps } = k._k;

    if (pts.length < 3) {
        throw new Error(
            `Polygon's need more than two points, ${pts.length} points provided`,
        );
    }
    return {
        id: "polygon",
        pts,
        colors: opt.colors,
        uv: opt.uv,
        tex: opt.tex,
        radius: opt.radius,
        draw(this: GameObj<PolygonComp>) {
            k.drawPolygon(Object.assign(getRenderProps(this), {
                pts: this.pts,
                colors: this.colors,
                uv: this.uv,
                tex: this.tex,
                radius: this.radius,
                fill: opt.fill,
                triangulate: opt.triangulate,
            }));
        },
        renderArea(this: GameObj<PolygonComp>) {
            return new Polygon(this.pts);
        },
        inspect() {
            return `polygon: ${this.pts.map(p => `[${p.x},${p.y}]`).join(",")}`;
        },
    };
}
