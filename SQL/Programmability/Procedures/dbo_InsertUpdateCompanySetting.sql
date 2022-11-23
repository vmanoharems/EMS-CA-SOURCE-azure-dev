SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

-- =============================================
CREATE PROCEDURE [dbo].[InsertUpdateCompanySetting]
(
@CompanyID int,
@AccountingCurrency nvarchar(50),
@ReportLabel nvarchar(20),
@RealTimeCurrency bit,
@FringeAccountID int,
@LaborAccountID int,
@SuspenseAccountID int,
@Createdby int,
@ProdID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    if exists(select * from CompanySetting where CompanyID=@CompanyID)
 begin

 
 update CompanySetting set AccountingCurrency=@AccountingCurrency,ReportLabel=@ReportLabel,RealTimeCurrency=@RealTimeCurrency,FringeAccountID=@FringeAccountID,
 LaborAccountID=@LaborAccountID,SuspenseAccountID=@SuspenseAccountID,modifieddate=CURRENT_TIMESTAMP,modifiedby=@Createdby where CompanyID=@CompanyID

 select @CompanyID 

 end
 else
 begin
 
 
 insert into CompanySetting (CompanyID,AccountingCurrency,ReportLabel,RealTimeCurrency,FringeAccountID,LaborAccountID,SuspenseAccountID,Createddate,createdby,ProdID) values
 (@CompanyID,@AccountingCurrency,@ReportLabel,@RealTimeCurrency,@FringeAccountID,@LaborAccountID,@SuspenseAccountID,CURRENT_TIMESTAMP,@Createdby,@ProdID)

 select @CompanyID


 end

END





GO