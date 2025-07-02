-- CreateTable
CREATE TABLE "FarmAnalysis" (
    "id" TEXT NOT NULL,
    "farmEntryId" TEXT NOT NULL,
    "harvestDate" TIMESTAMP(3) NOT NULL,
    "steps" TEXT[],
    "risks" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FarmAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeatherForecast" (
    "id" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "forecast" TEXT NOT NULL,
    "temperature" INTEGER NOT NULL,
    "humidity" INTEGER NOT NULL,
    "windSpeed" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeatherForecast_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FarmAnalysis_farmEntryId_key" ON "FarmAnalysis"("farmEntryId");

-- CreateIndex
CREATE UNIQUE INDEX "WeatherForecast_location_date_key" ON "WeatherForecast"("location", "date");

-- AddForeignKey
ALTER TABLE "FarmAnalysis" ADD CONSTRAINT "FarmAnalysis_farmEntryId_fkey" FOREIGN KEY ("farmEntryId") REFERENCES "FarmEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
