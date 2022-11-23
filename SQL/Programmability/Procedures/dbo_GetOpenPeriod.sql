SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

-- =============================================
CREATE PROCEDURE [dbo].[GetOpenPeriod]
(
@ProdID int,
@CID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
 
  select ClosePeriodId,PeriodStatus from ClosePeriod where Status='Open' and CompanyId=@CID order by PeriodStatus;

 

END

GO