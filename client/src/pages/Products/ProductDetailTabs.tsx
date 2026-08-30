import { memo } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@client/src/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@client/src/components/ui/table";
import { Badge } from "@client/src/components/ui/badge";
import { useI18nStore } from "@client/src/store/useI18nStore";
import { getLocalizedField, parseCsvList } from "@client/src/utils/localized-field";
import type { BearingProduct } from "@shared/api.interface";

interface ProductDetailTabsProps {
  product: BearingProduct;
}

const PARAM_LABEL_MAP: Record<string, string> = {
  boreDiameter: "Bore Diameter",
  outerDiameter: "Outer Diameter",
  width: "Width",
  weight: "Weight",
  ratedLoad: "Rated Load",
  limitingSpeed: "Limiting Speed",
  material: "Material",
  sealType: "Seal Type",
  cageMaterial: "Cage Material",
};

const ProductDetailTabs = memo(function ProductDetailTabs({
  product,
}: ProductDetailTabsProps) {
  const { t, currentLanguage } = useI18nStore();

  const description = getLocalizedField(
    product as unknown as Record<string, unknown>,
    "description",
    currentLanguage,
    product.description || "",
  );
  const certificationsList = parseCsvList(product.certifications);
  const parameters = product.parametersJson || {};
  const paramEntries = Object.entries(parameters).filter(
    ([, v]) => v !== undefined && v !== null && v !== "",
  );

  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="w-full h-auto p-1 bg-muted/60 rounded-t-lg rounded-b-none border-b-0">
        <TabsTrigger value="description" className="flex-1 py-2">
          {t("products.description")}
        </TabsTrigger>
        <TabsTrigger value="specifications" className="flex-1 py-2">
          {t("products.specifications")}
        </TabsTrigger>
        <TabsTrigger value="certifications" className="flex-1 py-2">
          {t("products.certifications")}
        </TabsTrigger>
        <TabsTrigger value="packaging" className="flex-1 py-2">
          Packaging &amp; Shipping
        </TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="border border-border border-t-0 rounded-b-lg p-5 md:p-6 mt-0">
        {description ? (
          <div className="prose prose-sm max-w-none text-foreground leading-relaxed">
            <p className="whitespace-pre-line">{description}</p>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            No description available.
          </p>
        )}
      </TabsContent>

      <TabsContent value="specifications" className="border border-border border-t-0 rounded-b-lg p-0 mt-0 overflow-hidden">
        {paramEntries.length > 0 ? (
          <Table>
            <TableBody>
              {paramEntries.map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell className="w-1/3 font-medium text-muted-foreground bg-muted/30">
                    {PARAM_LABEL_MAP[key] || key}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {String(value)}
                  </TableCell>
                </TableRow>
              ))}
              {product.material && (
                <TableRow>
                  <TableCell className="w-1/3 font-medium text-muted-foreground bg-muted/30">
                    {t("products.material")}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {product.material}
                  </TableCell>
                </TableRow>
              )}
              {product.precisionLevel && (
                <TableRow>
                  <TableCell className="w-1/3 font-medium text-muted-foreground bg-muted/30">
                    {t("products.precision")}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {product.precisionLevel}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        ) : (
          <div className="p-6 text-sm text-muted-foreground">
            No specifications available.
          </div>
        )}
      </TabsContent>

      <TabsContent value="certifications" className="border border-border border-t-0 rounded-b-lg p-5 md:p-6 mt-0">
        {certificationsList.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {certificationsList.map((cert: string) => (
              <Badge
                key={cert}
                variant="default"
                className="text-sm px-4 py-1.5 font-medium"
              >
                {cert}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            No certification information available.
          </p>
        )}
      </TabsContent>

      <TabsContent value="packaging" className="border border-border border-t-0 rounded-b-lg p-5 md:p-6 mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-foreground mb-3">Packaging</h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Industrial-grade plastic tube packaging</li>
              <li>• Inner box + outer carton (standard export packaging)</li>
              <li>• Custom packaging available for OEM orders</li>
              <li>• Palletized shipping for bulk orders</li>
              <li>• Anti-rust oil treatment before packaging</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">Shipping</h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Lead time: 15-30 days (stock items: 3-7 days)</li>
              <li>• Shipping methods: Sea / Air / Express</li>
              <li>• Ports: Shanghai, Ningbo, Qingdao</li>
              <li>• Trade terms: FOB, CIF, EXW, DDP</li>
              <li>• Sample shipping via DHL/FedEx/UPS</li>
            </ul>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
});

export default ProductDetailTabs;
