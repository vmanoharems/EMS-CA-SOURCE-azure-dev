SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

-- Batch submitted through debugger: SQLQuery8.sql|7|0|C:\Users\Admin\AppData\Local\Temp\~vs98D7.sql

CREATE PROCEDURE [dbo].[GetStartEndPeriodByCompanyId]   -- GetStartEndPeriodByCompanyId 1
@CompanyID int
AS
BEGIN
declare @defvalue varchar(30)
declare @Periodtype varchar(50)
declare @perioddate datetime
declare @max int
declare @ClosePId int

declare @tz  int;
set @tz = dbo.tzforproduction(0);

	SET NOCOUNT ON;

select 
	cp.ClosePeriodId,cp.CompanyId
	,CONVERT(VARCHAR(11),dbo.TZfromUTC(cp.StartPeriod,@tz),106) as StartPeriod
	,CONVERT(VARCHAR(11),dbo.TZfromUTC(cp.EndPeriod,@tz),106) as EndPeriod
	, cp.Status,cp.CreatedBy,cp.ModifiedBy,co.PeriodStartType,cp.CompanyPeriod,cp.PeriodStatus
from ClosePeriod  Cp
join Company Co on Co.CompanyID=cp.CompanyId
where cp.CompanyId=@CompanyID 
and cp.Status<>'Closed' 
and cp.PeriodStatus='Current'
         
        
END





GO