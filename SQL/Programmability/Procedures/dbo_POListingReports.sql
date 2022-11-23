CREATE PROCEDURE [dbo].[POListingReports]  ---  POListingReports 14,'1','5','5','1/1/0001','1/13/2017','' ,'','','','','','',''
	-- Add the parameters for the stored procedure here
	@ProdId int,
	@CompanyId int,
	@PeriodNoFrom nvarchar(50),
	@PeriodNoTo nvarchar(50),
	@CreateDateFrom date,
	@CreateDateTo date,
	@PoNoFrom nvarchar(50),
	@PoNoTo nvarchar(50),
	@VendorId nvarchar(50),
	@Batch nvarchar(50),
	@UserName nvarchar(50),
	@POStatus nvarchar(50),
	@LocationSubTotal bit,
	@EpisodeSubTotal bit
AS
BEGIN

if(@CreateDateFrom ='')
	set @CreateDateFrom= '01/01/1999';

if(@CreateDateTo='')
	begin
		set @CreateDateTo=  DATEADD(day,1,GETDATE());
	end
else
	begin
		set @CreateDateTo=  DATEADD(day,1,@CreateDateTo);
	end

if @PeriodNoFrom = ''
	set @PeriodNoFrom = 0;
if @PeriodNoTo = ''
	set @PeriodNoTo = dbo.[GetCurrentOpenPeriodID](@CompanyID,1);

select P.POID, P.PONumber
, case when P.Status = 'Closed' then 0 else P.BalanceAmount end as BalanceAmount
from PurchaseOrder P
left outer join tblVendor V on V.VendorID = P.VendorID
left outer join ClosePeriod c on c.ClosePeriodId=P.ClosePeriodId

where P.ProdID =@ProdId and p.CompanyID=@CompanyId
 and dbo.TZfromUTC( P.CreatedDate,dbo.tzforproduction(0)) between @CreateDateFrom and @CreateDateTo
 and (P.ClosePeriodId between @PeriodNoFrom and @PeriodNoTo)
 and (P.VendorID in (select * FROM dbo.SplitCSV(@VendorID,',')) OR @VendorID='')
 and (P.BatchNumber in (select * FROM dbo.SplitCSV(@Batch,',')) OR @Batch='')
 and (P.Status = @POStatus or @POStatus = '')
 order by P.PONumber

END
GO